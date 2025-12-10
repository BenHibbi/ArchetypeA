import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/studio'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function SettingsPage() {
  const t = await getTranslations('studio.settings')

  return (
    <>
      <Header title={t('title')} subtitle={t('subtitle')} />

      <div className="p-6 max-w-2xl space-y-6">
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
            <CardDescription>
              {t('profileDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" disabled placeholder="admin@example.com" />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>{t('branding')}</CardTitle>
            <CardDescription>
              {t('brandingDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>{t('logo')}</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <span className="text-xs text-slate-400">{t('logo')}</span>
                </div>
                <Button variant="outline">{t('change')}</Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">{t('companyName')}</Label>
              <Input id="company" placeholder={t('companyPlaceholder')} />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">{t('dangerZone')}</CardTitle>
            <CardDescription>
              {t('dangerZoneDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">{t('deleteAllData')}</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
