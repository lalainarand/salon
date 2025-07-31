import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Bloc 1 - Présentation */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">Beauty Salon</h3>
            <p className="text-gray-300">
              Votre beauté, notre passion. Découvrez nos services professionnels dans un cadre élégant et relaxant.
            </p>
          </div>

          {/* Bloc 2 - Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-sage" />
                <span>Ankadindramamy, Tananarive</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-sage" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-sage" />
                <span>contact@beautysalon.fr</span>
              </div>
            </div>
          </div>

          {/* Bloc 3 - Horaires */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <div className="flex items-start space-x-3 text-gray-300">
              <Clock className="h-5 w-5 text-sage mt-1" />
              <div>
                <p>Lun - Ven : 9h - 19h</p>
                <p>Samedi : 9h - 17h</p>
                <p>Dimanche : Fermé</p>
              </div>
            </div>
          </div>

          {/* Bloc 4 - Liens utiles */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/services" className="hover:underline">
                  Nos services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>© 2024 Beauty Salon. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
