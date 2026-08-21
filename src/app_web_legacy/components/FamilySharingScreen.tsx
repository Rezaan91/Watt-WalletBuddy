import { useState } from "react";
import { ArrowLeft, UserPlus, Users, Shield, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router";

const familyMembers = [
  { id: 1, name: "Zhaida Juries", email: "zhaida@wattwallet.co.za", role: "Primary", canPurchase: true, canViewUsage: true, relationship: "Account Holder" },
  { id: 2, name: "Keagsan Juries", email: "keagsan@wattwallet.co.za", role: "Member", canPurchase: true, canViewUsage: true, relationship: "Husband" },
  { id: 3, name: "Nicole Jacobs", email: "nicole.j@wattwallet.co.za", role: "Member", canPurchase: false, canViewUsage: true, relationship: "Sister" },
  { id: 4, name: "Simon Van Wayk", email: "simon@wattwallet.co.za", role: "Member", canPurchase: true, canViewUsage: false, relationship: "Tenant", isPending: true },
];

export default function FamilySharingScreen() {
  const [members, setMembers] = useState(familyMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      setMembers([
        ...members,
        {
          id: members.length + 1,
          name: "New Member",
          email: newMemberEmail,
          role: "Member",
          canPurchase: false,
          canViewUsage: true,
        },
      ]);
      setSuccessMessage(`Invitation sent to ${newMemberEmail}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setNewMemberEmail("");
      setShowAddMember(false);
    }
  };

  const confirmRemoveMember = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      setMembers(members.filter((m) => m.id !== id));
      setSuccessMessage(`${member.name} removed from family sharing`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setConfirmDelete(null);
    }
  };

  const handleTogglePurchase = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (member && member.role !== "Primary") {
      setMembers(
        members.map((m) =>
          m.id === id ? { ...m, canPurchase: !m.canPurchase } : m
        )
      );
      setSuccessMessage(
        `${member.name}'s purchase permission ${!member.canPurchase ? "enabled" : "disabled"}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleToggleViewUsage = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (member && member.role !== "Primary") {
      setMembers(
        members.map((m) =>
          m.id === id ? { ...m, canViewUsage: !m.canViewUsage } : m
        )
      );
      setSuccessMessage(
        `${member.name}'s usage view permission ${!member.canViewUsage ? "enabled" : "disabled"}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Family Sharing</h1>
            <p className="text-sm text-muted-foreground">Manage shared meter access</p>
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
          <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground dark:text-gray-900">
            Share your smart meter with family members. You can control their permissions and monitor usage together.
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        )}

        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Family Member</span>
        </button>

        {showAddMember && (
          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 space-y-3">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddMember}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 bg-muted text-muted-foreground py-2 rounded-xl hover:bg-muted/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground px-2">Family Members</h3>
          {members.map((member) => (
            <div key={member.id} className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center text-sm">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p>{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full inline-block ${
                          member.role === "Primary"
                            ? "bg-primary/20 text-primary"
                            : member.isPending
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {member.isPending ? "Pending Invite" : member.role}
                      </span>
                      {member.relationship && (
                        <span className="text-xs px-2 py-1 rounded-full inline-block bg-blue-500/20 text-blue-400">
                          {member.relationship}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {member.role !== "Primary" && (
                  <button
                    onClick={() => setConfirmDelete(member.id)}
                    className="text-red-400 hover:text-red-300"
                    title="Remove member"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Can purchase electricity</span>
                  </div>
                  <button
                    onClick={() => handleTogglePurchase(member.id)}
                    disabled={member.role === "Primary"}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      member.canPurchase ? "bg-primary" : "bg-muted"
                    } ${member.role === "Primary" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                    title={member.role === "Primary" ? "Primary member permissions cannot be changed" : "Click to toggle"}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        member.canPurchase ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Can view usage</span>
                  </div>
                  <button
                    onClick={() => handleToggleViewUsage(member.id)}
                    disabled={member.role === "Primary"}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      member.canViewUsage ? "bg-primary" : "bg-muted"
                    } ${member.role === "Primary" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                    title={member.role === "Primary" ? "Primary member permissions cannot be changed" : "Click to toggle"}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        member.canViewUsage ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {member.role === "Primary" && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Primary account holder has full access by default
                </p>
              )}
            </div>
          ))}
        </div>

        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl">Remove Family Member?</h3>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-muted-foreground mb-6 mt-2">
                Are you sure you want to remove{" "}
                <span className="text-foreground font-semibold">
                  {members.find((m) => m.id === confirmDelete)?.name}
                </span>{" "}
                from family sharing? They will lose access to the shared meter.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => confirmRemoveMember(confirmDelete)}
                  className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-card/50 border border-border text-foreground py-3 rounded-xl hover:bg-card/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
