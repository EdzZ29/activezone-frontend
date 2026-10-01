"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormError, PasswordField, TextField } from "@/app/components/dashboard/fields";
import { SubmitButton } from "@/app/components/dashboard/forms";
import { useSession } from "@/app/components/dashboard/session";
import { useToast } from "@/app/components/dashboard/toast";
import { Badge, PageHeader, Panel } from "@/app/components/dashboard/ui";
import { api, errorMessage } from "@/lib/api/client";
import { formatDate, roleLabels } from "@/lib/format";

export function ProfileForms() {
  const { user } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [profile, setProfile] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? "" });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      await api("/auth/me", { method: "PATCH", body: profile });
      toast("Profile saved.");
      router.refresh();
    } catch (err) {
      setProfileError(errorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      setPwError("New passwords don't match.");
      return;
    }
    setSavingPw(true);
    setPwError(null);
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      toast("Password changed.");
    } catch (err) {
      setPwError(errorMessage(err));
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <>
      <PageHeader title="Profile" description={`Signed in as ${user.email}`} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Your details">
          <form onSubmit={saveProfile} className="space-y-5">
            <FormError message={profileError} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="First name" required value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              <TextField label="Last name" required value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            </div>
            <TextField label="Mobile number" type="tel" optional value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <TextField label="Email" value={user.email} disabled hint="Ask the front desk to change your login email." />
            <div className="flex items-center justify-between gap-4">
              <SubmitButton pending={savingProfile}>Save details</SubmitButton>
              <span className="flex items-center gap-2 text-xs text-zinc-500">
                <Badge tone="gray">{roleLabels[user.role]}</Badge> since {formatDate(user.createdAt)}
              </span>
            </div>
          </form>
        </Panel>

        <Panel title="Change password">
          <form onSubmit={changePassword} className="space-y-5">
            <FormError message={pwError} />
            <PasswordField label="Current password" autoComplete="current-password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
            <PasswordField label="New password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
            <PasswordField label="Confirm new password" autoComplete="new-password" required value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            <SubmitButton pending={savingPw}>Change password</SubmitButton>
          </form>
        </Panel>
      </div>
    </>
  );
}
