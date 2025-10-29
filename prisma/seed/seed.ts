import { PrismaClient, CocktailCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.cocktailIngredient.deleteMany();
  await prisma.cocktail.deleteMany();
  await prisma.ingredient.deleteMany();

  // Create ingredients
  console.log('Creating ingredients...');

  const whiteRum = await prisma.ingredient.create({
    data: {
      name: 'White Rum',
      description:
        'A light-bodied rum that is commonly used in cocktails. It has a subtle flavor that blends well with other ingredients.',
      isAlcoholic: true,
      imageUrl: null,
    },
  });

  const mint = await prisma.ingredient.create({
    data: {
      name: 'Fresh Mint',
      description:
        'Fresh mint leaves that add a refreshing, cool flavor to cocktails.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const limeJuice = await prisma.ingredient.create({
    data: {
      name: 'Lime Juice',
      description:
        'Freshly squeezed lime juice that adds citrus acidity and brightness.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const sugar = await prisma.ingredient.create({
    data: {
      name: 'White Sugar',
      description: 'Granulated white sugar used to sweeten cocktails.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const sodaWater = await prisma.ingredient.create({
    data: {
      name: 'Soda Water',
      description: 'Carbonated water that adds fizz and lightness to drinks.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const tequila = await prisma.ingredient.create({
    data: {
      name: 'Tequila',
      description:
        'A distilled alcoholic beverage made from blue agave plant, primarily produced in Mexico.',
      isAlcoholic: true,
      imageUrl: null,
    },
  });

  const tripleSeque = await prisma.ingredient.create({
    data: {
      name: 'Triple Sec',
      description: 'An orange-flavored liqueur used in many classic cocktails.',
      isAlcoholic: true,
      imageUrl: null,
    },
  });

  const vodka = await prisma.ingredient.create({
    data: {
      name: 'Vodka',
      description:
        'A clear distilled alcoholic beverage with a neutral flavor.',
      isAlcoholic: true,
      imageUrl: null,
    },
  });

  const tomatoJuice = await prisma.ingredient.create({
    data: {
      name: 'Tomato Juice',
      description: 'Fresh tomato juice used in savory cocktails.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const worcestershireSauce = await prisma.ingredient.create({
    data: {
      name: 'Worcestershire Sauce',
      description: 'A fermented condiment that adds umami and complexity.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const pineappleJuice = await prisma.ingredient.create({
    data: {
      name: 'Pineapple Juice',
      description: 'Sweet tropical juice from fresh pineapples.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const coconutCream = await prisma.ingredient.create({
    data: {
      name: 'Coconut Cream',
      description:
        'Rich, creamy coconut product that adds tropical flavor and texture.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const gingerBeer = await prisma.ingredient.create({
    data: {
      name: 'Ginger Beer',
      description: 'A spicy, carbonated soft drink with strong ginger flavor.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const orangeJuice = await prisma.ingredient.create({
    data: {
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  const grenadine = await prisma.ingredient.create({
    data: {
      name: 'Grenadine',
      description: 'A sweet, red syrup made from pomegranate.',
      isAlcoholic: false,
      imageUrl: null,
    },
  });

  console.log(`Created ${15} ingredients`);

  // Create cocktails
  console.log('Creating cocktails...');

  const mojito = await prisma.cocktail.create({
    data: {
      name: 'Mojito',
      category: CocktailCategory.CLASSIC,
      instructions:
        'Muddle mint leaves with sugar and lime juice in a glass. Add rum and fill with ice. Top with soda water and garnish with mint sprig.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: whiteRum.id, amount: '50ml' },
          { ingredientId: mint.id, amount: '10 leaves' },
          { ingredientId: limeJuice.id, amount: '30ml' },
          { ingredientId: sugar.id, amount: '2 teaspoons' },
          { ingredientId: sodaWater.id, amount: 'Top up' },
        ],
      },
    },
  });

  const margarita = await prisma.cocktail.create({
    data: {
      name: 'Margarita',
      category: CocktailCategory.CLASSIC,
      instructions:
        'Shake tequila, triple sec, and lime juice with ice. Strain into a salt-rimmed glass filled with ice.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: tequila.id, amount: '50ml' },
          { ingredientId: tripleSeque.id, amount: '25ml' },
          { ingredientId: limeJuice.id, amount: '25ml' },
        ],
      },
    },
  });

  const bloodyMary = await prisma.cocktail.create({
    data: {
      name: 'Bloody Mary',
      category: CocktailCategory.LONG_DRINK,
      instructions:
        'Mix vodka, tomato juice, lemon juice, Worcestershire sauce, hot sauce, salt, and pepper in a tall glass with ice. Garnish with celery and lemon wedge.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: vodka.id, amount: '45ml' },
          { ingredientId: tomatoJuice.id, amount: '90ml' },
          { ingredientId: limeJuice.id, amount: '15ml' },
          { ingredientId: worcestershireSauce.id, amount: '3 dashes' },
        ],
      },
    },
  });

  const pinaColada = await prisma.cocktail.create({
    data: {
      name: 'Piña Colada',
      category: CocktailCategory.TROPICAL,
      instructions:
        'Blend white rum, coconut cream, and pineapple juice with ice until smooth. Pour into a chilled glass and garnish with pineapple wedge.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: whiteRum.id, amount: '60ml' },
          { ingredientId: coconutCream.id, amount: '50ml' },
          { ingredientId: pineappleJuice.id, amount: '90ml' },
        ],
      },
    },
  });

  const moscowMule = await prisma.cocktail.create({
    data: {
      name: 'Moscow Mule',
      category: CocktailCategory.LONG_DRINK,
      instructions:
        'Fill a copper mug with ice. Add vodka and lime juice, then top with ginger beer. Garnish with lime wedge and mint.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: vodka.id, amount: '45ml' },
          { ingredientId: limeJuice.id, amount: '15ml' },
          { ingredientId: gingerBeer.id, amount: '120ml' },
        ],
      },
    },
  });

  const virginMojito = await prisma.cocktail.create({
    data: {
      name: 'Virgin Mojito',
      category: CocktailCategory.MOCKTAIL,
      instructions:
        'Muddle mint leaves with sugar and lime juice in a glass. Fill with ice and top with soda water. Garnish with mint sprig.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: mint.id, amount: '12 leaves' },
          { ingredientId: limeJuice.id, amount: '30ml' },
          { ingredientId: sugar.id, amount: '2 teaspoons' },
          { ingredientId: sodaWater.id, amount: 'Top up' },
        ],
      },
    },
  });

  const shirleyTemple = await prisma.cocktail.create({
    data: {
      name: 'Shirley Temple',
      category: CocktailCategory.MOCKTAIL,
      instructions:
        'Fill a glass with ice. Add grenadine and top with ginger ale or lemon-lime soda. Garnish with a cherry.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: grenadine.id, amount: '15ml' },
          { ingredientId: gingerBeer.id, amount: '180ml' },
          { ingredientId: orangeJuice.id, amount: '30ml' },
        ],
      },
    },
  });

  const tequilaSunrise = await prisma.cocktail.create({
    data: {
      name: 'Tequila Sunrise',
      category: CocktailCategory.LONG_DRINK,
      instructions:
        'Pour tequila and orange juice over ice in a tall glass. Slowly pour grenadine down the side to create a sunrise effect. Do not stir.',
      imageUrl: null,
      ingredients: {
        create: [
          { ingredientId: tequila.id, amount: '45ml' },
          { ingredientId: orangeJuice.id, amount: '90ml' },
          { ingredientId: grenadine.id, amount: '15ml' },
        ],
      },
    },
  });

  console.log(`Created ${8} cocktails`);

  console.log('Database seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`  - Ingredients: ${15}`);
  console.log(`  - Cocktails: ${8}`);
  console.log(`  - Alcoholic cocktails: ${6}`);
  console.log(`  - Non-alcoholic cocktails (mocktails): ${2}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
