/**
 * Cocktail category enum
 * Must match the CocktailCategory enum in Prisma schema
 */
export enum CocktailCategory {
  CLASSIC = 'CLASSIC',
  TROPICAL = 'TROPICAL',
  MOCKTAIL = 'MOCKTAIL',
  SHOOTER = 'SHOOTER',
  LONG_DRINK = 'LONG_DRINK',
  SOUR = 'SOUR',
  CREAMY = 'CREAMY',
  HOT_DRINK = 'HOT_DRINK',
}

/**
 * Array of all cocktail categories for validation and iteration
 */
export const COCKTAIL_CATEGORIES = Object.values(CocktailCategory);

/**
 * Human-readable descriptions for each category
 */
export const COCKTAIL_CATEGORY_DESCRIPTIONS: Record<CocktailCategory, string> = {
  [CocktailCategory.CLASSIC]: 'Classic cocktails like Mojito, Margarita, Old Fashioned',
  [CocktailCategory.TROPICAL]: 'Tropical cocktails like Piña Colada, Mai Tai',
  [CocktailCategory.MOCKTAIL]: 'Non-alcoholic cocktails like Virgin Mojito, Shirley Temple',
  [CocktailCategory.SHOOTER]: 'Shot drinks like Tequila Shot, B-52',
  [CocktailCategory.LONG_DRINK]: 'Long drinks like Long Island, Cuba Libre',
  [CocktailCategory.SOUR]: 'Sour cocktails like Whiskey Sour, Amaretto Sour',
  [CocktailCategory.CREAMY]: 'Creamy cocktails like White Russian, Baileys-based drinks',
  [CocktailCategory.HOT_DRINK]: 'Hot cocktails like Irish Coffee, Hot Toddy',
};
