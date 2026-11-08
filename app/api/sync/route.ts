import { NextResponse } from "next/server";

// Permanent Master Index Object on restful-api.dev
const MASTER_INDEX_ID = "ff808181a09d98f701a1bc788c8e6813";
const REST_API_URL = "https://api.restful-api.dev/objects";

type AccountRef = {
  objectId: string;
  passcode: string;
  name: string;
  updatedAt: number;
};

function normalizeAccountKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "");
}

async function getMasterIndex(): Promise<{ id: string; accounts: Record<string, AccountRef> }> {
  try {
    const res = await fetch(`${REST_API_URL}/${MASTER_INDEX_ID}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load master index");
    const json = await res.json();
    return {
      id: MASTER_INDEX_ID,
      accounts: json?.data?.accounts || {},
    };
  } catch (err) {
    console.error("Master index read error:", err);
    return { id: MASTER_INDEX_ID, accounts: {} };
  }
}

async function updateMasterIndex(accounts: Record<string, AccountRef>): Promise<boolean> {
  try {
    const res = await fetch(`${REST_API_URL}/${MASTER_INDEX_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aura Focus Engine - Master Accounts Index",
        data: { accounts },
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    console.error("Master index write error:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, account, passcode, payload } = body;

    if (!account || typeof account !== "string") {
      return NextResponse.json({ error: "Account identifier is required" }, { status: 400 });
    }

    const key = normalizeAccountKey(account);
    if (!key || key.length < 2) {
      return NextResponse.json({ error: "Invalid account name or email" }, { status: 400 });
    }

    const cleanPasscode = String(passcode || "").trim();
    if (!cleanPasscode || cleanPasscode.length < 3) {
      return NextResponse.json(
        { error: "Passcode must be at least 3 characters" },
        { status: 400 }
      );
    }

    const master = await getMasterIndex();
    const existingRef = master.accounts[key];

    // ACTION: LOGIN / REGISTER
    if (action === "login") {
      if (existingRef) {
        // Verify Passcode
        if (existingRef.passcode !== cleanPasscode) {
          return NextResponse.json(
            { error: "Incorrect passcode for this account. Please try again." },
            { status: 401 }
          );
        }

        // Fetch user data from object
        const objRes = await fetch(`${REST_API_URL}/${existingRef.objectId}`, { cache: "no-store" });
        if (objRes.ok) {
          const objJson = await objRes.json();
          return NextResponse.json({
            success: true,
            account: key,
            objectId: existingRef.objectId,
            payload: objJson?.data?.payload || null,
            lastSyncedAt: existingRef.updatedAt || Date.now(),
            isNew: false,
          });
        }
      }

      // If account does not exist yet -> Register it!
      const initialPayload = payload || {
        profile: {
          name: key.includes("@") ? key.split("@")[0] : account.trim(),
          avatar: "/aura-logo.png",
          weeklyTargetHours: 14,
        },
      };

      const createRes = await fetch(REST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Aura User - ${key}`,
          data: {
            account: key,
            payload: initialPayload,
            updatedAt: Date.now(),
          },
        }),
      });

      if (!createRes.ok) {
        return NextResponse.json(
          { error: "Could not create cloud account object" },
          { status: 500 }
        );
      }

      const createdObj = await createRes.json();
      const objectId = createdObj.id;

      master.accounts[key] = {
        objectId,
        passcode: cleanPasscode,
        name: account.trim(),
        updatedAt: Date.now(),
      };

      await updateMasterIndex(master.accounts);

      return NextResponse.json({
        success: true,
        account: key,
        objectId,
        payload: initialPayload,
        lastSyncedAt: Date.now(),
        isNew: true,
      });
    }

    // ACTION: SYNC / SAVE
    if (action === "sync") {
      if (!existingRef) {
        return NextResponse.json({ error: "Account not found. Please sign in first." }, { status: 404 });
      }

      if (existingRef.passcode !== cleanPasscode) {
        return NextResponse.json({ error: "Unauthorized passcode" }, { status: 401 });
      }

      const now = Date.now();
      const putRes = await fetch(`${REST_API_URL}/${existingRef.objectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Aura User - ${key}`,
          data: {
            account: key,
            payload: payload || {},
            updatedAt: now,
          },
        }),
        cache: "no-store",
      });

      if (!putRes.ok) {
        return NextResponse.json({ error: "Failed to update cloud data" }, { status: 500 });
      }

      master.accounts[key].updatedAt = now;
      await updateMasterIndex(master.accounts);

      return NextResponse.json({
        success: true,
        account: key,
        lastSyncedAt: now,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
