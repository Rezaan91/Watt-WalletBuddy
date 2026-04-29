import { useState } from "react";
import { ArrowLeft, UserPlus, Users, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const familyMembers = [
  { id: 1, name: "Thabo Mbeki", email: "thabo.mbeki@example.com", role: "Primary", canPurchase: true, canViewUsage: true },
  { id: 2, name: "Nomsa Mbeki", email: "nomsa.mbeki@example.com", role: "Member", canPurchase: true, canViewUsage: true },
  { id: 3, name: "Sipho Mbeki", email: "sipho.mbeki@example.com", role: "Member", canPurchase: false, canViewUsage: true },
];

export default function FamilySharingScreen() {
  const [members, setMembers] = useState(familyMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
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
      setNewMemberEmail("");
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
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
          <p className="text-sm text-blue-100">
            Share your smart meter with family members. You can control their permissions and monitor usage together.
          </p>
        </div>

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
                    <span
                      className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        member.role === "Primary"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
                {member.role !== "Primary" && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-400 hover:text-red-300"
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
                  <div
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      member.canPurchase ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        member.canPurchase ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Can view usage</span>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      member.canViewUsage ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        member.canViewUsage ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
