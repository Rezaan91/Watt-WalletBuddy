import { useState } from "react";
import { ArrowLeft, CreditCard, Plus, Trash2, Check, Building2 } from "lucide-react";
import { useNavigate } from "react-router";

const savedCards = [
  { id: 1, type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: 2, type: "Mastercard", last4: "8888", expiry: "09/26", isDefault: false },
];

const bankAccounts = [
  { id: 1, bank: "Standard Bank", accountNumber: "****1234", isDefault: false },
];

export default function PaymentMethodsScreen() {
  const [cards, setCards] = useState(savedCards);
  const [accounts, setAccounts] = useState(bankAccounts);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const navigate = useNavigate();

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [bankData, setBankData] = useState({
    bank: "",
    accountNumber: "",
    accountType: "Cheque",
    branchCode: "",
  });

  const handleAddCard = () => {
    if (cardData.number && cardData.name && cardData.expiry && cardData.cvv) {
      setCards([
        ...cards,
        {
          id: cards.length + 1,
          type: cardData.number.startsWith("4") ? "Visa" : "Mastercard",
          last4: cardData.number.slice(-4),
          expiry: cardData.expiry,
          isDefault: false,
        },
      ]);
      setCardData({ number: "", name: "", expiry: "", cvv: "" });
      setShowAddCard(false);
    }
  };

  const handleAddBank = () => {
    if (bankData.bank && bankData.accountNumber && bankData.branchCode) {
      setAccounts([
        ...accounts,
        {
          id: accounts.length + 1,
          bank: bankData.bank,
          accountNumber: `****${bankData.accountNumber.slice(-4)}`,
          isDefault: false,
        },
      ]);
      setBankData({ bank: "", accountNumber: "", accountType: "Cheque", branchCode: "" });
      setShowAddBank(false);
    }
  };

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Payment Methods</h1>
            <p className="text-sm text-muted-foreground">Manage cards and bank accounts</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-3 px-2">Credit/Debit Cards</h3>
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p>{card.type} •••• {card.last4}</p>
                    {card.isDefault && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {!showAddCard ? (
              <button
                onClick={() => setShowAddCard(true)}
                className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border-2 border-dashed border-border/50 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Card</span>
              </button>
            ) : (
              <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                    className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCard}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Add Card
                  </button>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-xl hover:bg-muted/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-3 px-2">Bank Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p>{account.bank}</p>
                    {account.isDefault && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {!showAddBank ? (
              <button
                onClick={() => setShowAddBank(true)}
                className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border-2 border-dashed border-border/50 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Bank Account</span>
              </button>
            ) : (
              <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 space-y-3">
                <select
                  value={bankData.bank}
                  onChange={(e) => setBankData({ ...bankData, bank: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Bank</option>
                  <option value="Standard Bank">Standard Bank</option>
                  <option value="FNB">FNB</option>
                  <option value="ABSA">ABSA</option>
                  <option value="Nedbank">Nedbank</option>
                  <option value="Capitec">Capitec</option>
                </select>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={bankData.accountType}
                  onChange={(e) => setBankData({ ...bankData, accountType: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Cheque">Cheque Account</option>
                  <option value="Savings">Savings Account</option>
                </select>
                <input
                  type="text"
                  placeholder="Branch Code"
                  value={bankData.branchCode}
                  onChange={(e) => setBankData({ ...bankData, branchCode: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddBank}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Add Account
                  </button>
                  <button
                    onClick={() => setShowAddBank(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-xl hover:bg-muted/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
