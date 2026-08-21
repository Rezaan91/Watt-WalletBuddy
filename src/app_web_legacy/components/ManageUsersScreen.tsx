import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, Mail, Phone, Copy, Check, UserPlus, UserMinus, Shield, User as UserIcon } from "lucide-react";
import { useUser } from "../context/UserContext";

interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "PRIMARY" | "SECONDARY";
  joinedDate: string;
}

export default function ManageUsersScreen() {
  const navigate = useNavigate();
  const { user, isPrimary } = useUser();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Get household members from localStorage
  const [members, setMembers] = useState<HouseholdMember[]>(() => {
    const saved = localStorage.getItem("householdUsers");
    if (saved) {
      return JSON.parse(saved);
    }
    // Juries Family demo data
    return [
      {
        id: "1",
        name: "Zhaida Juries",
        email: "zhaida@wattwalletdemo.co.za",
        phone: "+27 71 234 5678",
        role: "PRIMARY",
        joinedDate: "March 2026"
      },
      {
        id: "2",
        name: "Keagsan Juries",
        email: "keagsan@wattwalletdemo.co.za",
        phone: "+27 72 458 9136",
        role: "SECONDARY",
        joinedDate: "March 2026"
      },
      {
        id: "3",
        name: "Nicole Jacobs",
        email: "nicole@wattwalletdemo.co.za",
        phone: "+27 83 567 8901",
        role: "SECONDARY",
        joinedDate: "April 2026"
      },
      {
        id: "4",
        name: "Simon Van Wyk",
        email: "simon@wattwalletdemo.co.za",
        phone: "+27 84 678 9012",
        role: "SECONDARY",
        joinedDate: "Pending"
      }
    ];
  });

  const familyCode = user?.householdId || "JURIES-8472";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(familyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail && !invitePhone) return;

    // Mock sending invite
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteForm(false);
      setInviteEmail("");
      setInvitePhone("");
    }, 2000);
  };

  const handleRemoveUser = (userId: string) => {
    if (!isPrimary()) return;

    const confirmed = window.confirm("Are you sure you want to remove this user from your household?");
    if (confirmed) {
      const updatedMembers = members.filter(m => m.id !== userId);
      setMembers(updatedMembers);
      localStorage.setItem("householdUsers", JSON.stringify(updatedMembers));
    }
  };

  if (!isPrimary()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </button>

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              Only the primary account holder can manage users. Contact your household administrator for help.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </button>

        <div>
          <h1 className="text-3xl mb-2">Manage Users</h1>
          <p className="text-muted-foreground">Juries Family · {members.length} Members</p>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 mb-6">
          <h3 className="mb-4">Household Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Household Name</span>
              <span className="text-sm">Juries Family</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Meter Number</span>
              <span className="text-sm font-mono">04178522931</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Budget</span>
              <span className="text-sm">R 1,500</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-white">Family Code</h3>
              <p className="text-sm text-white/80">Share this code to invite members</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-xl p-4 flex items-center justify-between">
            <span className="text-2xl tracking-wider text-white">{familyCode}</span>
            <button
              onClick={handleCopyCode}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-xs text-white/70 mt-3">
            New members can use this code when signing up to join your household
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Household Members ({members.length})</h3>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>

          {showInviteForm && (
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 mb-4">
              <h4 className="mb-4">Send Invite</h4>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteEmail("");
                      setInvitePhone("");
                    }}
                    className="flex-1 bg-muted text-foreground py-3 rounded-xl hover:bg-muted/70 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!inviteEmail || inviteSent}
                    className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-3 rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {inviteSent ? "Sent!" : "Send Invite"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`p-4 flex items-center gap-4 ${
                  index !== members.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center text-white">
                  {member.role === "PRIMARY" ? (
                    <Shield className="w-6 h-6" />
                  ) : (
                    <UserIcon className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p>{member.name}</p>
                    {member.role === "PRIMARY" && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                    {member.joinedDate === "Pending" && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                        Pending Invite
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.joinedDate === "Pending" ? "Invite sent" : `Joined ${member.joinedDate}`}
                  </p>
                  {member.id === "2" && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        350 WC
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Last login: Today 08:42 AM
                      </span>
                    </div>
                  )}
                </div>

                {member.role === "SECONDARY" && (
                  <button
                    onClick={() => handleRemoveUser(member.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">
            <span className="text-blue-400">Tip:</span> Secondary users can view usage and request electricity, but only the primary account holder can approve purchases and manage users.
          </p>
        </div>
      </div>
    </div>
  );
}
