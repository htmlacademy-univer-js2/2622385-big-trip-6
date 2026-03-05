export default class Point {
  constructor(id, type, destinationId, basePrice, dateFrom, dateTo, isFavorite, offerIds) {
    this.id = id;
    this.type = type;              
    this.destinationId = destinationId; 
    this.basePrice = basePrice;     
    this.dateFrom = new Date(dateFrom); 
    this.dateTo = new Date(dateTo);      
    this.isFavorite = isFavorite;  
    this.offerIds = offerIds || []; 
  }
}
