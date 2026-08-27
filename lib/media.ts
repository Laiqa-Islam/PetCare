const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const siteMedia = {
  heroPet: pexels(15479701),
  care: {
    "reading-a-pet-food-label": pexels(8434635),
    "low-stress-grooming": pexels(15479701),
    "daily-enrichment": pexels(17891954),
    "vaccination-basics": pexels(6234626),
    "healthy-aging-mobility": pexels(1805164),
    "senior-pet-checklist": pexels(19690518),
  } as Record<string, string>,
  vets: [pexels(6234633, 800), pexels(7470633, 800), pexels(6235017, 800), pexels(6235244, 800)],
  products: {
    Food: pexels(8434635),
    Grooming: pexels(15479701),
    Toys: pexels(17891954),
    Health: pexels(6234626),
    Accessories: pexels(19690518),
    Travel: pexels(6805651),
    Training: pexels(1805164),
  } as Record<string, string>,
  adoption: [pexels(15479701), pexels(17891954), pexels(7154606)],
};
