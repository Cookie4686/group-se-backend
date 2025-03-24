const mongoose = require('mongoose');

const CoWorkingSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district: {
        type: String,
        required: [true,'Please add a district']
    },
    province: {
        type: String,
        required: [true,'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength:[5,'Postal code can not be more than 5 digits']
    },
    tel:{
        type: String
    },
    open_close_time:{
        type: String,
        required: [true,'Please add open-close time'],
    },
    picture:{
        type: String,
        required: [false],
    }
}, {
        toJSON: {virtuals:true},
        toObject:{virtuals:true}
    
});

//Reverse populate with virtuals
CoWorkingSpaceSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'co-working-space',
    justOne:false
});

module.exports=mongoose.model('CoWorkingSpace',CoWorkingSpaceSchema);