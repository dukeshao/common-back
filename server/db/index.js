//引入模块中的客户端对象
const { MongoClient, ObjectId } = require('mongodb');
const { mongo: mongourl, database } = require('../config.json');
//利用MongoClient连接数据
async function connect() {
    let client = await MongoClient.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });
    //连接数据库,无则自动创建
    let db = client.db(database);
    return {
        db,
        client
    }
}


// @增
exports.create = async (colName, data) => {
    let { db, client } = await connect();
    //根据colName获取集合
    let collection = db.collection(colName);

    //执行mongo增加数据语句
    let result;
    try {
        result = await collection[Array.isArray(data) ? 'insertMany' : 'insertOne'](data);
    } catch (err) {
        result = err;
    }

    //关闭当前连接,释放资源
    client.close();
    return result;
}

/**
 * @删
 * @param {String} colName   集合名称
 * @param {Object} query     查询条件
 * @return                   返回值
 */
exports.deletes = async (colName, query) => {
    let { db, client } = await connect();
    let collection = db.collection(colName);

    if (query._id) {
        // 通过id查询数据必须使用这种格式
        // _id:'xxx' -> _id:ObjectId('xxx');
        // query._id = ObjectId(query._id);
        query._id = query._id.map(m => ObjectId(m))
    }

    let result;
    try {
        // result = await collection.deleteMany(query)
        //批量删除
        result = await collection.deleteMany({ _id: { $in: query._id } })
    } catch (err) {
        result = err
    }

    // 关闭当前连接，释放资源
    client.close();

    return result;
}

/**
 * @改
 */
exports.update = async (colName, query, data) => {
    let { db, client } = await connect();
    let collection = db.collection(colName);

    if (query._id) {
        query._id = ObjectId(query._id);
    }

    let result;
    try {
        result = await collection.updateOne(query, { $set: data });
    } catch (err) {
        result = err;
    }

    // 关闭当前连接，释放资源
    client.close();

    return result;
}

/**
 * @查
 */
exports.find = async (colName, query = {}, { skip = 0, limit, sort } = {}) => {
    // console.log("find_query=>", colName)
    let { db, client } = await connect();
    let collection = db.collection(colName);
    if (query._id) {
        // 通过id查询数据必须使用这种格式
        // _id:'xxx' -> _id:ObjectId('xxx');
        query._id = ObjectId(query._id);
    };
    let result;
    try {
        // console.log(skip,limit,sort);
        result = await collection.find(query).skip(skip).toArray();
        // console.log(result);

        //排序
        if (sort && !limit) {
            result = await collection.find(query).sort(sort).skip(skip).toArray();
        }

        // 截取数量
        if (limit && !sort) {
            result = await collection.find(query).skip(skip).limit(limit).toArray();
        }

        //排序并截取
        if (limit && sort) {
            result = await collection.find(query).skip(skip).sort(sort).limit(limit).toArray();
        }
        // console.log(result);


    } catch (err) {
        result = err
    }
    // console.log("find=>", result);
    // 关闭当前连接，释放资源
    client.close();
    return result;
}