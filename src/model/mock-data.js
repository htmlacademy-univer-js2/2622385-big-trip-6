import Destination from './destination-model.js';
import Offer from './offer-model.js';
import Point from './point-model.js';
import { PointType } from './const.js';

export const mockDestinations = [
  new Destination(
    'dest-1',
    'Chamonix',
    'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    [
      { src: 'http://picsum.photos/300/200?r=0.0762563005163317', description: 'Chamonix parliament building' },
      { src: 'http://picsum.photos/300/200?r=0.0762563005163318', description: 'Chamonix mountain view' }
    ]
  ),
  new Destination(
    'dest-2',
    'Geneva',
    'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman.',
    [
      { src: 'http://picsum.photos/300/200?r=0.1762563005163317', description: 'Geneva lake' },
      { src: 'http://picsum.photos/300/200?r=0.2762563005163317', description: 'Geneva fountain' }
    ]
  ),
  new Destination(
    'dest-3',
    'Amsterdam',
    'Amsterdam is the capital city of the Netherlands, known for its artistic heritage and canal system.',
    [
      { src: 'http://picsum.photos/300/200?r=0.3762563005163317', description: 'Amsterdam canal' },
      { src: 'http://picsum.photos/300/200?r=0.4762563005163317', description: 'Amsterdam museums' }
    ]
  )
];

export const mockOffers = [
  new Offer('offer-1', 'Upgrade to a business class', 120, PointType.TAXI),
  new Offer('offer-2', 'Add luggage', 50, PointType.TAXI),
  new Offer('offer-3', 'Choose the radio station', 15, PointType.TAXI),
  
  new Offer('offer-4', 'Include breakfast', 25, PointType.BUS),
  new Offer('offer-5', 'WiFi onboard', 10, PointType.BUS),
  
  new Offer('offer-6', 'First class', 150, PointType.TRAIN),
  new Offer('offer-7', 'Meal included', 30, PointType.TRAIN),
  
  new Offer('offer-8', 'Add luggage', 70, PointType.FLIGHT),
  new Offer('offer-9', 'Comfort class', 120, PointType.FLIGHT),
  new Offer('offer-10', 'Add meal', 25, PointType.FLIGHT),
  
  new Offer('offer-11', 'Cabin with a view', 200, PointType.SHIP),
  new Offer('offer-12', 'All inclusive', 350, PointType.SHIP)
];

export const mockPoints = [
  new Point(
    'point-1',
    PointType.TAXI,
    'dest-1', // Chamonix
    1100,
    '2019-07-10T22:55:56.845Z',
    '2019-07-11T11:22:13.375Z',
    false,
    ['offer-1', 'offer-2'] 
  ),
  new Point(
    'point-2',
    PointType.FLIGHT,
    'dest-2', 
    2500,
    '2019-07-12T08:30:00.000Z',
    '2019-07-12T13:45:00.000Z',
    true,
    ['offer-8', 'offer-9']
  ),
  new Point(
    'point-3',
    PointType.TRAIN,
    'dest-3', 
    850,
    '2019-07-13T14:20:00.000Z',
    '2019-07-13T18:10:00.000Z',
    false,
    ['offer-6']
  ),
  new Point(
    'point-4',
    PointType.BUS,
    'dest-1',
    350,
    '2019-07-14T09:15:00.000Z',
    '2019-07-14T12:30:00.000Z',
    true,
    ['offer-4', 'offer-5']
  ),
  new Point(
    'point-5',
    PointType.SHIP,
    'dest-2', 
    1800,
    '2019-07-15T10:00:00.000Z',
    '2019-07-15T16:30:00.000Z',
    false,
    ['offer-11']
  )
];

export const getDestinations = () => mockDestinations;

export const getOffers = () => mockOffers;

export const getOffersByType = (type) => {
  return mockOffers.filter(offer => offer.type === type);
};

export const getPoints = () => mockPoints;

export const getDestinationById = (id) => {
  return mockDestinations.find(dest => dest.id === id);
};

export const getOffersByIds = (offerIds) => {
  return mockOffers.filter(offer => offerIds.includes(offer.id));
};