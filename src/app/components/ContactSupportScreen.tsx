import { ArrowLeft, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

export default function ContactSupportScreen() {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open("https://wa.me/27821234567?text=Hi%20WattWallet,%20I%20need%20help%20with...", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@wattwallet.co.za?subject=Support Request";
  };

  const handlePhone = () => {
    window.location.href = "tel:+27821234567";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Contact Support</h1>
            <p className="text-sm text-muted-foreground">We're here to help</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
          <h3 className="text-lg mb-2">24/7 Support</h3>
          <p className="text-sm text-white/80">
            Our support team is available around the clock to assist you with any questions or issues.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground px-2">Contact Methods</h3>

          <button
            onClick={handleWhatsApp}
            className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4 hover:bg-card/70 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <p>WhatsApp</p>
              <p className="text-sm text-muted-foreground">Chat with us instantly</p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
              Recommended
            </div>
          </button>

          <button
            onClick={handleEmail}
            className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4 hover:bg-card/70 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <p>Email</p>
              <p className="text-sm text-muted-foreground">support@wattwallet.co.za</p>
            </div>
          </button>

          <button
            onClick={handlePhone}
            className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4 hover:bg-card/70 transition-colors"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p>Phone</p>
              <p className="text-sm text-muted-foreground">+27 82 123 4567</p>
            </div>
          </button>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50">
          <h3 className="mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Office Location</span>
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>WattWallet Head Office</p>
            <p>123 Main Street</p>
            <p>Sandton, Johannesburg</p>
            <p>2196, South Africa</p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
          <h4 className="text-sm mb-3">Operating Hours</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">WhatsApp & Email</span>
              <span>24/7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone Support</span>
              <span>8:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Office Hours</span>
              <span>Mon-Fri 9:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-sm text-foreground dark:text-gray-900">
            <strong>Average response time:</strong> We typically respond within 2 hours during business hours and within 24 hours outside business hours.
          </p>
        </div>
      </div>
    </div>
  );
}
