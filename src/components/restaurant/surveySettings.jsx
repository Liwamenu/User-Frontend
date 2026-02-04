import { useState } from "react";
import * as Icons from "lucide-react";
import { CancelI } from "../../assets/icon";
import { restaurantData } from "../../../../client/generate/liwamenu";

// Mock translation hook
const useTranslation = () => {
  return {
    t: (key, options) => {
      const translations = {
        "announcementSettings.title": `${options?.name} - Survey Configuration`,
        "survey.categories.food": "Food Quality",
        "survey.categories.service": "Service",
        "survey.categories.ambiance": "Ambiance",
        "survey.categories.hygiene": "Hygiene",
        "survey.categories.staff": "Staff Behavior",
      };
      return translations[key] || key;
    },
  };
};

const SurveySettings = ({ data }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(
    data?.surveySettings || restaurantData.restaurantData.surveySettings,
  );
  const [activeTab, setActiveTab] = useState("editor");

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const removeCategory = (key) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.key !== key),
    }));
  };

  return (
    <div className="w-full pb-5 mt-1 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold bg-indigo-800 text-white py-5 px-6 sm:px-14 flex justify-between items-center">
          <span>{t("announcementSettings.title", { name: data?.name })}</span>
          <div className="flex bg-white/10 rounded-lg p-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === "editor" ? "bg-white text-indigo-800 shadow-sm" : "hover:bg-white/10 text-white"}`}
            >
              Configuration
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === "preview" ? "bg-white text-indigo-800 shadow-sm" : "hover:bg-white/10 text-white"}`}
            >
              Preview
            </button>
          </div>
        </h1>

        <div className="px-6 sm:px-14 py-8">
          {activeTab === "editor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Settings */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-indigo-900">Active Status</h3>
                    <button
                      onClick={handleToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.enabled ? "bg-indigo-600" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enabled ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-indigo-700/80 leading-relaxed">
                    When enabled, customers will be prompted to rate these
                    categories after completing their order or visit.
                  </p>
                </div>

                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    Statistics Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Responses
                      </span>
                      <span className="text-xl font-bold text-gray-700">
                        1,284
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Avg Score
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                    Survey Categories
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg transition-colors border border-indigo-100">
                    <CancelI className="rotate-45" />
                    Add Category
                  </button>
                </div>

                <div className="grid gap-3">
                  {settings.categories.map((cat) => (
                    <div
                      key={cat.key}
                      className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="block font-semibold text-gray-800">
                            {t(cat.labelKey)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {cat.key}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Icons.Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeCategory(cat.key)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                        <div className="ml-2 p-1 text-gray-300 cursor-grab active:cursor-grabbing">
                          <Icons.GripVertical className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto py-4">
              <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="bg-indigo-800 p-8 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Icons.MessageSquareQuote className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    How was your visit?
                  </h2>
                  <p className="text-indigo-100 text-sm">
                    Your feedback helps us provide a better experience for you.
                  </p>
                </div>
                <div className="p-8 space-y-6">
                  {settings.categories.map((cat) => (
                    <div key={cat.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
                          Rate this
                        </span>
                      </div>
                      <div className="flex justify-between gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="flex-grow aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-400 transition-all"
                          >
                            <Icons.Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                      Submit Feedback
                    </button>
                    <button className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="px-6 sm:px-14 pb-8 flex justify-end gap-3 border-t border-gray-50 pt-8">
          <button className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Defaults
          </button>
          <button className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5">
            Save Survey Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveySettings;
