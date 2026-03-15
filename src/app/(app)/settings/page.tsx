"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";

const TIMEZONE_OPTIONS = [
  { value: "America/Mexico_City", label: "Ciudad de México (CST)" },
  { value: "America/Monterrey", label: "Monterrey (CST)" },
  { value: "America/Tijuana", label: "Tijuana (PST)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "America/Bogota", label: "Bogotá (COT)" },
  { value: "America/Lima", label: "Lima (PET)" },
  { value: "America/Santiago", label: "Santiago (CLT)" },
  { value: "America/Buenos_Aires", label: "Buenos Aires (ART)" },
  { value: "Europe/Madrid", label: "Madrid (CET)" },
];

const CURRENCY_OPTIONS = [
  { value: "MXN", label: "MXN — Peso mexicano ($)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "COP", label: "COP — Peso colombiano ($)" },
  { value: "PEN", label: "PEN — Sol peruano (S/)" },
  { value: "CLP", label: "CLP — Peso chileno ($)" },
  { value: "ARS", label: "ARS — Peso argentino ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
];

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
];

export default function SettingsPage() {
  const restaurant = useQuery(api.restaurants.getMyRestaurant);
  const updateName = useMutation(api.restaurants.updateRestaurantName);
  const updateSettings = useMutation(api.restaurants.updateRestaurantSettings);

  // Restaurant name
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savedName, setSavedName] = useState(false);

  // Preferences
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [currency, setCurrency] = useState("MXN");
  const [language, setLanguage] = useState("es");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name ?? "");
      setTimezone(restaurant.timezone ?? "America/Mexico_City");
      setCurrency(restaurant.currency ?? "MXN");
      setLanguage(restaurant.language ?? "es");
    }
  }, [restaurant]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurant || !name.trim()) return;
    setSavingName(true);
    try {
      await updateName({ id: restaurant._id, name: name.trim() });
      setSavedName(true);
      setTimeout(() => setSavedName(false), 2500);
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurant) return;
    setSavingPrefs(true);
    try {
      await updateSettings({ id: restaurant._id, timezone, currency, language });
      setSavedPrefs(true);
      setTimeout(() => setSavedPrefs(false), 2500);
    } finally {
      setSavingPrefs(false);
    }
  }

  if (restaurant === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your restaurant workspace"
      />

      <div className="max-w-lg space-y-6">

        {/* Restaurant name */}
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Restaurant</h2>
          <p className="text-sm text-gray-500 mb-5">
            The name that appears across your workspace.
          </p>
          <form onSubmit={handleSaveName} className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Name</Label>
              <Input
                id="restaurantName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your restaurant name"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={savingName || !name.trim() || name.trim() === restaurant?.name}
              >
                {savingName ? "Saving..." : "Save"}
              </Button>
              {savedName && (
                <span className="text-sm text-green-600 font-medium">✓ Saved</span>
              )}
            </div>
          </form>
        </Card>

        {/* Preferences */}
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Preferences</h2>
          <p className="text-sm text-gray-500 mb-5">
            Timezone, currency, and display language.
          </p>
          <form onSubmit={handleSavePrefs} className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={timezone}
                onValueChange={setTimezone}
                options={TIMEZONE_OPTIONS}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={currency}
                onValueChange={setCurrency}
                options={CURRENCY_OPTIONS}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={language}
                onValueChange={setLanguage}
                options={LANGUAGE_OPTIONS}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={savingPrefs}>
                {savingPrefs ? "Saving..." : "Save Preferences"}
              </Button>
              {savedPrefs && (
                <span className="text-sm text-green-600 font-medium">✓ Saved</span>
              )}
            </div>
          </form>
        </Card>

        {/* Plan */}
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Plan</h2>
          <p className="text-sm text-gray-500 mb-5">Your current subscription.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Current plan</span>
              <Badge variant="success">Free Trial</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">POS Integrations</span>
              <span className="text-sm text-gray-400">Coming soon</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Multi-location</span>
              <span className="text-sm text-gray-400">Coming soon</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
