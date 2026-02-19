import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Save, Trash2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { AvatarUpload } from '../components/profile/AvatarUpload';
import { MultiSelectChips } from '../components/profile/MultiSelectChips';
import { ToggleChips } from '../components/profile/ToggleChips';
import { InterestTagGrid } from '../components/profile/InterestTagGrid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function Profile() {
  const [saved, setSaved] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    homeAirport: 'LAX - Los Angeles International',
    passportCountry: 'United States',
  });

  // Travel preferences
  const [preferences, setPreferences] = useState({
    preferredAirlines: ['United Airlines', 'Delta'],
    preferredHotels: ['Marriott', 'Hilton'],
    lodgingStyle: 'hotel',
    transitPreferences: ['Prefer direct flights'],
    travelInterests: ['Food & Wine', 'Art & Museums', 'Photography'],
    budgetDefault: 'moderate',
    dietaryRestrictions: 'Vegetarian',
    accessibilityNeeds: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailSharedTrips: true,
    priceAlerts: false,
  });

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    apple: false,
  });

  const airlines = [
    'United Airlines',
    'Delta',
    'American Airlines',
    'Southwest',
    'JetBlue',
    'Alaska Airlines',
    'Spirit',
    'Frontier',
  ];

  const hotels = [
    'Marriott',
    'Hilton',
    'IHG',
    'Hyatt',
    'Accor',
    'Wyndham',
    'Choice Hotels',
    'Best Western',
  ];

  const transitOptions = [
    'Open to rail travel',
    'Prefer direct flights',
    'Budget carrier OK',
    'Premium economy preferred',
  ];

  const interests = [
    { name: 'History', icon: '🏛️' },
    { name: 'Food & Wine', icon: '🍷' },
    { name: 'Art & Museums', icon: '🎨' },
    { name: 'Adventure/Outdoors', icon: '🏔️' },
    { name: 'Beach & Relaxation', icon: '🏖️' },
    { name: 'Nightlife', icon: '🎉' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Photography', icon: '📸' },
    { name: 'Family-friendly', icon: '👨‍👩‍👧‍👦' },
    { name: 'Off the beaten path', icon: '🗺️' },
    { name: 'Wellness & Spa', icon: '💆' },
    { name: 'Wildlife & Nature', icon: '🦁' },
  ];

  const handleSave = () => {
    console.log('Saving profile:', { profile, preferences, notifications });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarUpload = (file: File) => {
    console.log('Uploading avatar:', file);
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account');
    // In a real app, this would call an API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-medium">Profile & Preferences</h1>
            </div>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saved ? (
                <>
                  <Check className="size-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-6">Profile</h2>
            
            <div className="space-y-6">
              <AvatarUpload onUpload={handleAvatarUpload} />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="homeAirport">Home Airport / City</Label>
                  <Input
                    id="homeAirport"
                    placeholder="e.g., LAX - Los Angeles"
                    value={profile.homeAirport}
                    onChange={(e) => setProfile({ ...profile, homeAirport: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Used as default origin for flights</p>
                </div>

                <div>
                  <Label htmlFor="passportCountry">Passport Country</Label>
                  <Input
                    id="passportCountry"
                    placeholder="e.g., United States"
                    value={profile.passportCountry}
                    onChange={(e) => setProfile({ ...profile, passportCountry: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">For visa information</p>
                </div>
              </div>
            </div>
          </section>

          {/* Travel Preferences Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-2">Travel Preferences</h2>
            <p className="text-sm text-gray-600 mb-6">These preferences help personalize your trip planning</p>
            
            <div className="space-y-8">
              {/* Preferred Airlines */}
              <div>
                <Label>Preferred Airlines</Label>
                <p className="text-sm text-gray-600 mb-3">Select your favorite airlines</p>
                <MultiSelectChips
                  options={airlines}
                  selected={preferences.preferredAirlines}
                  onChange={(selected) => setPreferences({ ...preferences, preferredAirlines: selected })}
                  placeholder="No airlines selected"
                />
              </div>

              {/* Preferred Hotels */}
              <div>
                <Label>Preferred Hotel Brands</Label>
                <p className="text-sm text-gray-600 mb-3">Select your favorite hotel brands</p>
                <MultiSelectChips
                  options={hotels}
                  selected={preferences.preferredHotels}
                  onChange={(selected) => setPreferences({ ...preferences, preferredHotels: selected })}
                  placeholder="No hotel brands selected"
                />
              </div>

              {/* Lodging Style */}
              <div>
                <Label htmlFor="lodgingStyle">Lodging Style Preference</Label>
                <Select
                  value={preferences.lodgingStyle}
                  onValueChange={(value) => setPreferences({ ...preferences, lodgingStyle: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transit Preferences */}
              <div>
                <Label>Transit Preferences</Label>
                <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                <ToggleChips
                  options={transitOptions}
                  selected={preferences.transitPreferences}
                  onChange={(selected) => setPreferences({ ...preferences, transitPreferences: selected })}
                />
              </div>

              {/* Travel Interests */}
              <div>
                <Label>Travel Interests</Label>
                <p className="text-sm text-gray-600 mb-3">What do you enjoy most when traveling?</p>
                <InterestTagGrid
                  interests={interests}
                  selected={preferences.travelInterests}
                  onChange={(selected) => setPreferences({ ...preferences, travelInterests: selected })}
                />
              </div>

              {/* Budget Default */}
              <div>
                <Label htmlFor="budgetDefault">Default Budget Level</Label>
                <Select
                  value={preferences.budgetDefault}
                  onValueChange={(value) => setPreferences({ ...preferences, budgetDefault: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <p className="text-sm text-gray-600 mb-2">Used for food recommendations</p>
                <Input
                  id="dietaryRestrictions"
                  placeholder="e.g., vegetarian, gluten-free, nut allergy"
                  value={preferences.dietaryRestrictions}
                  onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
                />
              </div>

              {/* Accessibility Needs */}
              <div>
                <Label htmlFor="accessibilityNeeds">Accessibility Needs</Label>
                <Textarea
                  id="accessibilityNeeds"
                  placeholder="Describe any accessibility requirements..."
                  value={preferences.accessibilityNeeds}
                  onChange={(e) => setPreferences({ ...preferences, accessibilityNeeds: e.target.value })}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email notifications for shared trips</p>
                  <p className="text-sm text-gray-600">Get notified when someone shares a trip with you</p>
                </div>
                <Switch
                  checked={notifications.emailSharedTrips}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailSharedTrips: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Price alerts for saved trips</p>
                  <p className="text-sm text-gray-600">Coming soon - get alerts when prices change</p>
                </div>
                <Switch
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-6">Account</h2>
            
            <div className="space-y-6">
              {/* Connected Accounts */}
              <div>
                <Label>Connected Accounts</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                        <svg className="size-6" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {connectedAccounts.google ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-black rounded-lg flex items-center justify-center">
                        <svg className="size-6" viewBox="0 0 24 24" fill="white">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Apple</p>
                        <p className="text-sm text-gray-600">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {connectedAccounts.apple ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div>
                <Label>Password</Label>
                <Button variant="outline" className="mt-2">
                  Change Password
                </Button>
              </div>

              {/* Delete Account */}
              <div className="pt-6 border-t border-gray-200">
                <Label className="text-red-600">Danger Zone</Label>
                <p className="text-sm text-gray-600 mb-3">Once you delete your account, there is no going back.</p>
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-red-600 bg-background hover:bg-red-50 text-red-600 h-9 px-4 py-2">
                    <Trash2 className="size-4 mr-2" />
                    Delete Account
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers, including all saved trips and preferences.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}