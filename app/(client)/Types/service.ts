export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  couleur: string;
}

export interface Service {
  id: number;
  nom: string;
  prix: string; 
  duree_minutes: number;
  description: string;
  statut: number;
  categorie?: Categorie;
  image_url?:string;
}
