export interface DBProps<T> {
    onUpdate: () => void;
    initialData: T;
}

export interface TheDB<T> {
    data: T;
}

export enum DBStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface DBStateNone {
    status: DBStatus.NONE;
}

export interface DBStateLoading {
    status: DBStatus.LOADING;
}

export interface DBStateLoaded {
    status: DBStatus.LOADED;
}

export interface DBStateError {
    status: DBStatus.ERROR;
    message: string;
}

export default class DB<T> {
    db: TheDB<T>;
    onUpdate: () => void;
    constructor(props: DBProps<T>) {
        this.onUpdate = props.onUpdate;
        this.db = {
            data: props.initialData
        };
    }

    forceComponentUpdate() {
        this.onUpdate();
    }

    set(updateFun: (state: T) => T) {
        this.db.data = updateFun(this.db.data);
        this.forceComponentUpdate();
    }

    get(): T {
        return this.db.data;
    }
}
