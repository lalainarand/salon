import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Sparkles } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous mettons tout notre cœur dans chaque soin pour révéler votre beauté unique.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Des techniques de pointe et des produits haut de gamme pour des résultats exceptionnels.",
    },
    {
      icon: Users,
      title: "Écoute",
      description: "Chaque cliente est unique. Nous prenons le temps de comprendre vos besoins.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Nous nous formons continuellement aux dernières tendances et techniques.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cream to-beige-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-charcoal">
                À propos de <span className="text-sage block">Beauty Salon</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Depuis plus de 5 ans, Beauty Salon est votre refuge de beauté et de bien-être. Nous croyons que chaque
                femme mérite de se sentir belle et confiante, c'est pourquoi nous mettons tout notre savoir-faire à
                votre service.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre équipe de professionnelles passionnées vous accueille dans un cadre élégant et apaisant, où
                tradition et innovation se rencontrent pour vous offrir une expérience beauté inoubliable.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/salon.jpg"
                alt="Intérieur du salon Beauty Salon"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-4">Nos Valeurs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien pour vous offrir le meilleur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-full">
                    <value.icon className="h-8 w-8 text-sage" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/salon1.jpg"
                alt="Histoire du salon"
                width={500}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal">Notre Histoire</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Beauty Salon est né d'un rêve : créer un espace où la beauté et le bien-être se rencontrent dans une
                atmosphère chaleureuse et professionnelle. Fondé récemment, notre salon met à l’honneur la fraîcheur, 
                l’enthousiasme et l’audace d’une jeune équipe talentueuse.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Chaque jour, nous évoluons avec passion pour offrir à nos clientes les meilleurs soins, dans une ambiance 
                élégante, moderne et bienveillante.
              </p>
              <div className="text-center pt-4">
                <div className="text-3xl font-bold text-sage mb-2">+ de 500</div>
                <div className="text-gray-600">clientes déjà conquises</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-sage text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Nos Certifications & Partenaires</h2>
            <p className="text-xl opacity-90">
              Nous travaillons avec les meilleures marques pour vous garantir des résultats exceptionnels
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {["Mshop gadget", "Kérastase", "Dermalogica", "OPI"].map((brand, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-lg p-6 mb-4">
                  <div className="text-2xl font-bold">{brand}</div>
                </div>
                <p className="text-sm opacity-80">Partenaire certifié</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
