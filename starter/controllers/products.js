const Product =  require('../models/product')

const getAllProductsStatic = async(req,res) => {
    // const products = await Product.find({}).sort('name');
    // const products = await Product.find({}).sort('-name');
    // const products = await Product.find({}).sort('-name price');
    // const products = await Product.find({}).select('name price');
    // const products = await Product.find({}).select('name price').limit(10);
    const products = await Product.find({price:{$gt:30,$lt:60}})
    .sort('name')
    .select('name price')
    .limit(10) //pagination size
    .skip(5); //skips 1st 5 products in the array
    res.status(200).json({products:products,noOfHits:products.length})
}

const getAllProducts = async(req,res) => {
    const {featured,company,name,sort,fields,page,limit,numericFilters} = req.query;
    const queryObject = {} //this is done to avoid unknown props in the query object
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = {$regex:name, $options:'i'} //mongo query operators - searches for string/alpha letters u are passing 
    }
    if (numericFilters) {
        console.log(numericFilters); //'price>40,rating>=3'
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        };
        const reqex = /\b(<|<=|>|>=|=)\b/g 
        let filters = numericFilters.replace(reqex, (match) => `-${operatorMap[match]}-`) 
        console.log(filters);
        //'price-$gt-40,rating-$gte-3'  --- changing to mongoose language
        const options = ['price','rating'];
        filters = filters.split(',').forEach((item) => { //splitting 'price-$gt-40,rating-$gte-3'
            const [field,operator,value] = item.split('-'); //splitting 'price-$gt-40'
            if (options.includes(field)) {
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }

    console.log(queryObject);
    let result = Product.find(queryObject) //removed await here, for chaining sort, select etc

    //.SORT
    if (sort) {
        console.log(sort); // 'name,-price'
        const sortList = sort.split(',').join(' ');
        console.log(sortList);// 'name -price' (joins both with a space)
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt')
    }

    //.SELECT
    if (fields) {
        console.log(fields); //'name,price'
        const fieldsList =  fields.split(',').join(' '); //'name price'
        console.log(fieldsList);
        result = result.select(fieldsList);
    }

    //.SKIP .LIMIT
    const pageNo = Number(page) || 1
    const size = Number(limit) || 10
    const skip = (pageNo - 1) * size

    result = result.skip(skip).limit(size)

    const sortedProducts = await result;
    res.status(200).json({products:sortedProducts,noOfHits:sortedProducts.length})
}

module.exports = {getAllProducts, getAllProductsStatic}

//Incase of Mongoose 6, if the prop is not there in schema, it ignores that and takes only which is there.