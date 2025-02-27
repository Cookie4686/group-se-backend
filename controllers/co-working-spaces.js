const CoWorkingSpace=require('../models/CoWorkingSpace.js');
const Reservation=require('../models/Reservation.js');

//@desc     Get all co-working spaces
//@route    GET /api/v1/co-working-spaces
//@access   Public 
exports.getCoWorkingSpaces=async(req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery={...req.query};

    //Fields to exclude
    const removeFields=['select','sort','page','limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query String
    let queryStr=JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, $etc)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //Finding resource
    query=CoWorkingSpace.find(JSON.parse(queryStr)).populate('reservations');

    //Select Fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }

    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }

    //Pagination
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    const total=await CoWorkingSpace.countDocuments();

    query=query.skip(startIndex).limit(limit);

    //Executing query
    try{
        const coWorkingSpaces=await query;
        //Pagination result
        const pagination={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }
        if(startIndex>0){
                pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true,count:coWorkingSpaces.length,pagination,data:coWorkingSpaces});
    } catch(err){
        console.log(err);

        res.status(400).json({success:false});
    }
};

//@desc     Get single co-working space
//@route    GET /api/v1/co-working-spaces/:id
//@access   Public 
exports.getCoWorkingSpace=async(req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);

        if(!coWorkingSpace){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:coWorkingSpace});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Create a co-working space
//@route    POST /api/v1/co-working-spaces
//@access   Private
exports.createCoWorkingSpace=async(req,res,next)=>{
    const coWorkingSpace =await CoWorkingSpace.create(req.body);
    res.status(201).json({
        success:true,
        data:coWorkingSpace
    });
};

//@desc     Update single co-working space
//@route    PUT /api/v1/co-working-spaces/:id
//@access   Private
exports.updateCoWorkingSpace=async(req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidator:true
        });
    
        if(!coWorkingSpace){
            return res.status(400).json({successs:false});
        }

        res.status(200).json({success:true,data:coWorkingSpace});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Delete single co-working space
//@route    DELETE /api/v1/co-working-spaces/:id
//@access   Private
exports.deleteCoWorkingSpace=async(req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);

        if(!coWorkingSpace){
            return res.status(404).json({success:false,message:`Co-working space not found with id of ${req.params.id}`});
        }
        await Reservation.deleteMany({coWorkingSpace:req.params.id});
        await CoWorkingSpace.deleteOne({_id:req.params.id});

        res.status(200).json({success:true,data: {}});
    }catch(err){
        res.status(400).json({success:false});
    }
};