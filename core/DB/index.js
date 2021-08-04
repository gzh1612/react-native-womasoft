import Realm from "realm";
import Redux from "../Redux";

const db_realm = 'framework_db_realm';
const db_realm_version = 'framework_db_realm_version';
const db_realm_schema = 'framework_db_realm_schema';
export default class DB {
    //获取数据库名称
    #getDBName = (params) => {
        if (typeof params === "string") return params;
        if (typeof params === "object") {
            return params.name;
        }
        console.warn('获取getDBName未找到name')
        return '';
    }
    //获取数据表id
    #getDBId = (name) => {
        const data = this.query(name).sorted('id', true)[0] ?? {};
        return data.id ?? 1;
    }

    constructor(realm) {
        const realmRedux = new Redux().get(db_realm);
        const schema = new Redux().get(db_realm_schema);
        const version = new Redux().get(db_realm_version);
        const config = {
            schemaVersion: version,
            path: DB.Path,
            schema: schema
        };
        if (realm) this.realm = realm;
        else if (realmRedux) this.realm = realmRedux;
        else this.realm = new Realm(config);
        if (!realmRedux) new Redux().add(db_realm, this.realm);
    }

    static Path = Realm.defaultPath;

    static Init = (DBClass, func, params = {}) => {
        if (typeof params.version === "undefined") params.version = 0;  // 版本
        let schema = [];
        if (DBClass.length >= 1) DBClass.map((item) => schema.push(item.schema));
        else schema.push(DBClass.schema);
        new Redux().add(db_realm_version, params.version);
        new Redux().add(db_realm_schema, schema);
        Realm.open({
            schemaVersion: params.version,
            path: DB.Path,
            schema: schema
        }).then(res => {
            const realm = new DB(res);
            if (typeof func === "function") func(realm);
        });
    }

    static Table = (tableName, properties = {}, init = []) => {
        return {
            name: tableName,
            schema: {
                name: tableName,
                properties: {
                    id: {type: 'int', indexed: true, default: 0},
                    ...properties,
                },
                primaryKey: 'id',
            },
            init: init
        }
    }

    add(name, params) {
        name = this.#getDBName(name);
        const id = this.#getDBId(name);//获取最后条id
        const options = (item, key) => {
            if (!item.id) item.id = id + key;//赋值id
            const data = this.get(name, item.id);
            if (data.id) return console.log(`数据已存在:${name} ${item.id}`, JSON.stringify(data));
            console.log(`添加成功：${name}`, JSON.stringify(item));
            this.realm.create(name, item);
        }
        if (typeof params === "object") {
            if (params.length > 0) params.map((item, key) => options(item, key + 1))
            else options(params, 1);
        } else {
            console.warn('create 参数 params 不是类型 object');
        }
        return params.length > 0 ? this.query(name) : params.id;
    }

    edit(name, params) {
        name = this.#getDBName(name);
        if (typeof params === "object") {
            if (params.length > 0) params.map((item) => this.realm.create(name, item, 'modified'))
            else this.realm.create(name, params, 'modified');
        } else {
            console.warn('create 参数 params 不是类型 object');
        }
        return params.length > 0 ? this.query(name) : params.id;
    }

    delete(name) {
        this.realm.delete(name);
    }

    deleteAll() {
        this.realm.deleteAll();
    }

    write(func) {
        try {
            this.realm.write(() => {
                if (typeof func === 'function') func(this.realm);
            });
        } catch (err) {
            console.warn('写入数据出错');
            console.warn(err);
        }
    }

    query(name) {
        name = this.#getDBName(name);
        return this.realm.objects(name) ?? [];
    }

    get(name, id) {
        name = this.#getDBName(name);
        return this.realm.objectForPrimaryKey(name, id) ?? {};
    }

    close() {
        this.realm.close();
    }


}
