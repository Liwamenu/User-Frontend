import { useState } from "react";
import {
  Maximize2,
  BarChart3,
  Languages,
  Type,
  EyeOff,
  DollarSign,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import CustomInput from "../common/customInput";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-indigo-500",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 focus:ring-red-500",
    ghost:
      "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Switch = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-indigo-600" : "bg-slate-200 group-hover:bg-slate-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
    {label && (
      <span className="text-sm font-medium text-slate-700">{label}</span>
    )}
  </label>
);

const Badge = ({ children, variant = "info" }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    info: "bg-indigo-50 text-indigo-700 border-indigo-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const RestaurantSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    tenant: "addis",
    maxDistance: "",
    googleAnalytics: "",
    menuLanguage: "Türkçe",
    parcelDelivery: true,
    parcelDiscount: "",
    slogan1: "",
    tableOrdering: true,
    tableOrderingDiscount: "",
    slogan2: "",
    hideRestaurant: false,
    specialPriceActive: false,
    specialPriceTag: "",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header section based on photo context */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-indigo-900">
            Addis Ababa Restoranı İçin Ayarlar
          </h1>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </div>

        <Card className="p-8 shadow-xl border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Tenant field with special formatting */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tenant (Örn: restoran.liwamenu.com)
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2 rounded-l-lg text-sm text-slate-500">
                    https://
                  </span>
                  <div className="flex-1">
                    <CustomInput
                      type="text"
                      value={formData.tenant}
                      onChange={(value) =>
                        setFormData({ ...formData, tenant: value })
                      }
                      className="border-slate-200 border-y border-x-0 rounded-none px-3 py-2 text-sm"
                      className2="mb-0"
                    />
                  </div>
                  <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2 rounded-r-lg text-sm text-slate-500">
                    .liwamenu.com
                  </span>
                </div>
              </div>

              <CustomInput
                label="Google Analytics websitesinden ulaşabilirsiniz."
                placeholder="Google Analytics Measurement-ID’nizi yazınız"
                value={formData.googleAnalytics}
                onChange={(value) =>
                  setFormData({ ...formData, googleAnalytics: value })
                }
              />

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Menu Dili Seçeneği
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={formData.menuLanguage}
                    onChange={(e) =>
                      setFormData({ ...formData, menuLanguage: e.target.value })
                    }
                  >
                    <option>Türkçe</option>
                    <option>English</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Languages size={16} />
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <CustomInput
                label="Slogan 1"
                placeholder="Slogan 1 giriniz"
                value={formData.slogan1}
                onChange={(value) =>
                  setFormData({ ...formData, slogan1: value })
                }
              />

              <CustomInput
                label="Slogan 2"
                placeholder="Slogan 2 giriniz"
                value={formData.slogan2}
                onChange={(value) =>
                  setFormData({ ...formData, slogan2: value })
                }
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <CustomInput
                label="Maksimum Mesafe (km) Paket servisi için"
                placeholder="Maksimum mesafe giriniz"
                type="number"
                value={formData.maxDistance}
                onChange={(value) =>
                  setFormData({ ...formData, maxDistance: value })
                }
              />

              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    Paket Sipariş
                  </span>
                  <Switch
                    checked={formData.parcelDelivery}
                    onChange={(val) =>
                      setFormData({ ...formData, parcelDelivery: val })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <CustomInput
                      label="Paket Sipariş İskonto"
                      placeholder="Paket Sipariş İskonto giriniz"
                      type="number"
                      value={formData.parcelDiscount}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          parcelDiscount: value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-7 bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600">
                    %
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    Masada Sipariş
                  </span>
                  <Switch
                    checked={formData.tableOrdering}
                    onChange={(val) =>
                      setFormData({ ...formData, tableOrdering: val })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <CustomInput
                      label="Masada Sipariş İskonto"
                      placeholder="Masada Sipariş İskonto giriniz"
                      type="number"
                      value={formData.tableOrderingDiscount}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          tableOrderingDiscount: value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-7 bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600">
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4 pt-8 border-t border-slate-100">
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <EyeOff size={18} className="text-slate-400" />
                Restoranı Gizle
              </span>
              <Switch
                checked={formData.hideRestaurant}
                onChange={(val) =>
                  setFormData({ ...formData, hideRestaurant: val })
                }
              />
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <DollarSign size={18} className="text-slate-400" />
                Özel Fiyatı Aktif Et
              </span>
              <Switch
                checked={formData.specialPriceActive}
                onChange={(val) =>
                  setFormData({ ...formData, specialPriceActive: val })
                }
              />
            </div>

            {/* Optional Special Price Box based on photo */}
            <div className="p-6 bg-orange-50/30 border border-orange-100 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="warning">ÖZEL FİYAT TANIMI (OPSİYONEL)</Badge>
              </div>
              <CustomInput
                label="Etiket (Örn: Maliyet, VIP)"
                placeholder="Personel, Müdavim gibi . . ."
                value={formData.specialPriceTag}
                onChange={(value) =>
                  setFormData({ ...formData, specialPriceTag: value })
                }
              />
            </div>
          </div>
        </Card>

        {/* Save button again at the bottom for convenience */}
        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full md:w-auto"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
          </Button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500 z-[100]">
          <div className="bg-emerald-500 p-1.5 rounded-full ring-4 ring-emerald-500/20">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">
              Ayarlar Kaydedildi
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Restoran yapılandırması başarıyla güncellendi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default RestaurantSettings;
