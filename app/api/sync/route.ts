import { NextResponse } from "next/server";

// High-capacity JSON Storage backend (supports full history, custom mixes, tasks)
const MASTER_REGISTRY_BIN_ID = "febfcbc";
const STORAGE_BASE_URL = "https://extendsclass.com/api/json-storage/bin";

type AccountRef = {
  binId: string;
  passcode: string;
  name: string;
  updatedAt: number;
};

type MasterRegistry = {
  _type: string;
  accounts: Record<string, AccountRef>;
};

function normalizeAccountKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "");
}

async function getMasterRegistry(): Promise<{ accounts: Record<string, AccountRef> }> {
  try {
    const res = await fetch(`${STORAGE_BASE_URL}/${MASTER_REGISTRY_BIN_ID}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load master registry");
    const json: MasterRegistry = await res.json();
    return {
      accounts: json?.accounts || {},
    };
  } catch (err) {
    console.error("Master registry read error:", err);
    return { accounts: {} };
  }
}

async function updateMasterRegistry(accounts: Record<string, AccountRef>): Promise<boolean> {
  try {
    const res = await fetch(`${STORAGE_BASE_URL}/${MASTER_REGISTRY_BIN_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _type: "Aura Master Accounts Registry",
        accounts,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    console.error("Master registry write error:", err);
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

    const master = await getMasterRegistry();
    const existingRef = master.accounts[key];

    // ACTION 1: LOGIN / REGISTER
    if (action === "login") {
      if (existingRef) {
        // Verify Passcode
        if (existingRef.passcode !== cleanPasscode) {
          return NextResponse.json(
            { error: "Incorrect passcode for this account. Please try again." },
            { status: 401 }
          );
        }

        // Fetch user data from their bin
        const binRes = await fetch(`${STORAGE_BASE_URL}/${existingRef.binId}`, {
          cache: "no-store",
        });

        if (binRes.ok) {
          const binJson = await binRes.json();
          return NextResponse.json({
            success: true,
            account: key,
            binId: existingRef.binId,
            payload: binJson?.payload || binJson || null,
            lastSyncedAt: existingRef.updatedAt || Date.now(),
            isNew: false,
          });
        }
      }

      // If account does not exist yet -> Register new bin!
      const initialPayload = payload || {
        profile: {
          name: key.includes("@") ? key.split("@")[0] : account.trim(),
          avatar: "/aura-logo.png",
          weeklyTargetHours: 14,
        },
      };

      const now = Date.now();
      const createRes = await fetch(STORAGE_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: key,
          payload: initialPayload,
          updatedAt: now,
        }),
      });

      if (!createRes.ok) {
        const errorText = await createRes.text().catch(() => "");
        console.error("Cloud storage creation error:", errorText);
        return NextResponse.json(
          { error: `Could not create cloud account object: ${errorText || createRes.statusText}` },
          { status: 500 }
        );
      }

      const createdObj = await createRes.json();
      const binId = createdObj.id;

      master.accounts[key] = {
        binId,
        passcode: cleanPasscode,
        name: account.trim(),
        updatedAt: now,
      };

      await updateMasterRegistry(master.accounts);

      return NextResponse.json({
        success: true,
        account: key,
        binId,
        payload: initialPayload,
        lastSyncedAt: now,
        isNew: true,
      });
    }

    // ACTION 2: SYNC / SAVE
    if (action === "sync") {
      if (!existingRef) {
        return NextResponse.json({ error: "Account not found. Please sign in first." }, { status: 404 });
      }

      if (existingRef.passcode !== cleanPasscode) {
        return NextResponse.json({ error: "Unauthorized passcode" }, { status: 401 });
      }

      const now = Date.now();
      const putRes = await fetch(`${STORAGE_BASE_URL}/${existingRef.binId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: key,
          payload: payload || {},
          updatedAt: now,
        }),
        cache: "no-store",
      });

      if (!putRes.ok) {
        const errText = await putRes.text().catch(() => "");
        return NextResponse.json({ error: `Failed to update cloud data: ${errText}` }, { status: 500 });
      }

      master.accounts[key].updatedAt = now;
      await updateMasterRegistry(master.accounts);

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
