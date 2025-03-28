// src/data/sample-data.js
// Sample data to demonstrate the data models

const { Wrestler, Championship, Event, Promotion } = require('../models');

/**
 * Generate sample data for testing
 */
function generateSampleData() {
  // Create sample wrestlers
  const wrestlers = [
    new Wrestler({
      name: 'The Champion',
      nickname: 'The Best',
      gender: 'male',
      age: 32,
      height: 188,
      weight: 102,
      homeTown: 'Chicago, IL',
      attributes: {
        strength: 85,
        speed: 75,
        technique: 90,
        charisma: 88,
        stamina: 80,
        microphone: 85,
        popularity: 95
      },
      style: {
        primary: 'Technical',
        secondary: 'Powerhouse',
        signature: 'Perfect Suplex',
        finisher: 'Champion Lock',
        preferredRole: 'Face',
        currentRole: 'Face'
      },
      traits: ['Ambitious', 'Hardworking', 'Perfectionist'],
      contract: {
        salary: 5000
      }
    }),
    new Wrestler({
      name: 'High Flyer',
      nickname: 'The Aerial Wonder',
      gender: 'male',
      age: 28,
      height: 175,
      weight: 82,
      homeTown: 'San Diego, CA',
      attributes: {
        strength: 65,
        speed: 95,
        technique: 85,
        charisma: 80,
        stamina: 75,
        microphone: 70,
        popularity: 82
      },
      style: {
        primary: 'High-Flyer',
        secondary: 'Technical',
        signature: 'Phoenix Splash',
        finisher: 'Shooting Star Press',
        preferredRole: 'Face',
        currentRole: 'Face'
      },
      traits: ['Risk-Taker', 'Innovative', 'Fan Favorite'],
      contract: {
        salary: 3500
      }
    }),
    new Wrestler({
      name: 'The Powerhouse',
      nickname: 'The Unstoppable Force',
      gender: 'male',
      age: 35,
      height: 198,
      weight: 130,
      homeTown: 'Detroit, MI',
      attributes: {
        strength: 95,
        speed: 60,
        technique: 70,
        charisma: 75,
        stamina: 85,
        microphone: 65,
        popularity: 78
      },
      style: {
        primary: 'Powerhouse',
        secondary: 'Brawler',
        signature: 'Spine Buster',
        finisher: 'Power Bomb',
        preferredRole: 'Heel',
        currentRole: 'Heel'
      },
      traits: ['Intimidating', 'Short-tempered', 'Dominant'],
      contract: {
        salary: 4000
      }
    }),
    new Wrestler({
      name: 'The Veteran',
      nickname: 'The Legend',
      gender: 'male',
      age: 42,
      height: 185,
      weight: 98,
      homeTown: 'Boston, MA',
      attributes: {
        strength: 75,
        speed: 65,
        technique: 95,
        charisma: 90,
        stamina: 70,
        microphone: 92,
        popularity: 85
      },
      style: {
        primary: 'Technical',
        secondary: 'Submission',
        signature: 'Dragon Suplex',
        finisher: 'Veteran Crossface',
        preferredRole: 'Face',
        currentRole: 'Heel'
      },
      traits: ['Respected', 'Mentor', 'Traditionalist'],
      contract: {
        salary: 4800
      }
    })
  ];

  // Create sample championships
  const championships = [
    new Championship({
      name: 'World Championship',
      prestige: 95,
      description: 'The most prestigious title in the company',
      type: {
        gender: 'male',
        weight: 'heavyweight',
        level: 'main event',
        team: false
      },
      currentChampion: {
        wrestlerId: wrestlers[0].id,
        name: wrestlers[0].name,
        wonOn: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
        defenseCount: 4
      }
    }),
    new Championship({
      name: 'Intercontinental Championship',
      prestige: 80,
      description: 'The workhorse championship',
      type: {
        gender: 'male',
        weight: 'any',
        level: 'midcard',
        team: false
      },
      currentChampion: {
        wrestlerId: wrestlers[1].id,
        name: wrestlers[1].name,
        wonOn: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
        defenseCount: 2
      }
    })
  ];

  // Create sample events
  const events = [
    new Event({
      name: 'Weekly Showdown',
      date: new Date().toISOString(),
      type: 'Weekly Show',
      venue: {
        name: 'City Arena',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        capacity: 5000,
        cost: 10000
      },
      attendance: {
        tickets: {
          available: 5000,
          sold: 4200
        },
        ticketPrices: {
          general: 25,
          premium: 60,
          vip: 120
        }
      }
    }),
    new Event({
      name: 'Summer Slam',
      date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      type: 'Pay-Per-View',
      venue: {
        name: 'Major Stadium',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        capacity: 20000,
        cost: 50000
      },
      attendance: {
        tickets: {
          available: 20000,
          sold: 5000
        },
        ticketPrices: {
          general: 50,
          premium: 150,
          vip: 300
        }
      }
    })
  ];

  // Add sample matches to events
  events[0].addMatch({
    title: 'World Championship Match',
    type: 'Singles',
    participants: [
      { id: wrestlers[0].id, name: wrestlers[0].name, role: 'Face' },
      { id: wrestlers[2].id, name: wrestlers[2].name, role: 'Heel' }
    ],
    championship: championships[0].id,
    bookedOutcome: wrestlers[0].id // Champion retains
  });

  events[0].addMatch({
    title: 'Intercontinental Championship Match',
    type: 'Singles',
    participants: [
      { id: wrestlers[1].id, name: wrestlers[1].name, role: 'Face' },
      { id: wrestlers[3].id, name: wrestlers[3].name, role: 'Heel' }
    ],
    championship: championships[1].id,
    bookedOutcome: wrestlers[1].id // Champion retains
  });

  // Create sample promotion
  const promotion = new Promotion({
    name: 'Global Wrestling Entertainment',
    shortName: 'GWE',
    isPlayerOwned: true,
    details: {
      owner: 'Player Name',
      headquartersCity: 'Stamford',
      headquartersCountry: 'USA'
    },
    reputation: {
      overall: 80,
      localMarket: 85,
      nationalMarket: 75,
      internationalMarket: 60
    },
    fanBase: {
      total: 1000000,
      loyalty: 75
    },
    finances: {
      balance: 5000000,
      weeklyRevenue: 500000,
      weeklyExpenses: 400000
    }
  });

  // Schedule weekly shows
  promotion.scheduleShow('weekly', {
    name: 'Monday Night Mayhem',
    day: 'Monday',
    time: '20:00',
    duration: 180,
    venue: 'Various Arenas',
    broadcastPartner: 'USA Network'
  });

  promotion.scheduleShow('weekly', {
    name: 'Friday Night Fury',
    day: 'Friday',
    time: '20:00',
    duration: 120,
    venue: 'Various Arenas',
    broadcastPartner: 'FOX'
  });

  // Add championships to promotion
  promotion.championships = championships.map(c => c.id);

  // Return sample data
  return {
    wrestlers,
    championships,
    events,
    promotion
  };
}

module.exports = { generateSampleData };