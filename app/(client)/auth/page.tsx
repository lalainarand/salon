"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification";



export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showSuccess, hideNotification, notification } = useSuccessNotification();
  const [email, setEmail] = useState("hapowav569@idsho.com")
  const [password, setPassword] = useState("B]P9kKa-sy.1x-3I")



  const { login, register, loading, error } = useAuth()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value
    await login({ email, password },
      (data) => {
        showSuccess("Connexion réussie !");
        router.push("/services");

        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    )
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = e.currentTarget.firstName.value + " " + e.currentTarget.lastName.value
    const email = e.currentTarget.registerEmail.value
    const phone = e.currentTarget.phone.value
    const password = e.currentTarget.registerPassword.value
    const password_confirmation = e.currentTarget.confirmPassword.value

    await register({ name, email, phone, password, password_confirmation },
      (data) => {
        showSuccess("Inscription réussie !");
        router.push("/services");
      }
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-beige-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-2">
            Beauty Salon
          </h1>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-2xl font-playfair text-charcoal text-center">
                    Bon retour !
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Connectez-vous à votre compte
                  </p>
                </CardHeader>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      {/* <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" required /> */}
                      <Input
                        id="email"
                        type="email"
                        value={email} // valeur contrôlée
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      {/* <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10"
                        required
                      /> */}
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-sage hover:bg-sage/90 text-white py-3 rounded-full"
                    disabled={loading}
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-2xl font-playfair text-charcoal text-center">
                    Rejoignez-nous !
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Créez votre compte Beauty Salon
                  </p>
                </CardHeader>

                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="firstName" placeholder="Prénom" className="pl-10" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="lastName" placeholder="Nom" className="pl-10" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="registerEmail" type="email" placeholder="votre@email.com" className="pl-10" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="01 23 45 67 89" required />
                  </div>

                  <div>
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Créer un mot de passe"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-sage hover:bg-sage/90 text-white py-3 rounded-full"
                    disabled={loading}
                  >
                    {loading ? "Création..." : "Créer mon compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {/* Notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={6000}
      />
    </div>
  )
}
