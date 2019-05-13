export class DataAnalyzer {
    constructor() {
        //
    }

    public analyseData(data: string[]): IAnalyzedDataTree {
        const result: IAnalyzedDataTree = {};
        // chaque ligne est un json
        for (const line of data) {
            if (!line) continue;
            const json = JSON.parse(line) as IFirebaseProfiler;
            if (!json.path) {
                console.log(json);
            }
            this.walkPath(result, json.path, 0, json);
        }
        return result;
    }

    private walkPath(parentNode: IAnalyzedDataTree, path: string[], index: number, firebaseData: IFirebaseProfiler) {
        if (!path || index >= path.length) {
            return;
        }
        const nodeName = path[index];
        parentNode[nodeName] = parentNode[nodeName] || this.createEmptyAnalyzedData();
        this.compileData(parentNode[nodeName], firebaseData);
        this.walkPath(parentNode[nodeName].childs, path, ++index, firebaseData);
    }

    private createEmptyAnalyzedData(): IAnalyzedData {
        const emptyData: IAnalyzedData = {
            broadcastSpeed: {
                avgExecutionTime: 0,
                avgPendingTime: 0,
                count: 0,
                totalExecutionTime: 0
            },
            connectSpeed: {
                avgExecutionSpeed: 0,
                avgPendingTime: 0,
                count: 0,
                path: "",
                totalExecutionSpeed: 0
            },
            disconnectSpeed: {
                avgExecutionSpeed: 0,
                avgPendingTime: 0,
                count: 0,
                path: "",
                totalExecutionSpeed: 0
            },
            writeSpeed: {
                avgExecutionTime: 0,
                avgPendingTime: 0,
                count: 0,
                permissionDenied: 0,
                totalExecutionTime: 0
            },
            readSpeed: {
                avgExecutionTime: 0,
                avgPendingTime: 0,
                count: 0,
                permissionDenied: 0,
                totalExecutionTime: 0
            },
            downloadedBytes: {
                average: 0,
                count: 0,
                total: 0
            },
            uploadedBytes: {
                average: 0,
                count: 0,
                total: 0
            },
            unindexedQueries: {
                count: 0,
                index: '',
                path: ''
            },
            childs: {}
        };
        return emptyData;
    }

    private compileData(currentdata: IAnalyzedData, firebaseData: IFirebaseProfiler) {
        if (firebaseData.name === 'listener-broadcast') {
            currentdata.broadcastSpeed.count++;
            currentdata.broadcastSpeed.totalExecutionTime += firebaseData.millis;
            currentdata.broadcastSpeed.avgExecutionTime = currentdata.broadcastSpeed.totalExecutionTime / currentdata.broadcastSpeed.count;

            currentdata.downloadedBytes.count++;
            currentdata.downloadedBytes.total += firebaseData.bytes;
            currentdata.downloadedBytes.average = currentdata.downloadedBytes.total / currentdata.downloadedBytes.count;
        } else if (firebaseData.name === 'listener-listen') {
            currentdata.readSpeed.count++;
            currentdata.readSpeed.totalExecutionTime += firebaseData.millis;
            currentdata.readSpeed.avgExecutionTime = currentdata.readSpeed.totalExecutionTime / currentdata.readSpeed.count;

            currentdata.downloadedBytes.count++;
            currentdata.downloadedBytes.total += firebaseData.bytes;
            currentdata.downloadedBytes.average = currentdata.downloadedBytes.total / currentdata.downloadedBytes.count;

        } else if (firebaseData.name === 'realtime-write') {
            currentdata.uploadedBytes.count++;
            currentdata.uploadedBytes.total += firebaseData.bytes;
            currentdata.uploadedBytes.average = currentdata.uploadedBytes.total / currentdata.uploadedBytes.count;

            currentdata.writeSpeed.count++;
            currentdata.writeSpeed.totalExecutionTime += firebaseData.millis;
            currentdata.writeSpeed.avgExecutionTime = currentdata.writeSpeed.totalExecutionTime / currentdata.writeSpeed.count;
        } else if (firebaseData.name === 'realtime-transaction') {
            currentdata.uploadedBytes.count++;
            currentdata.uploadedBytes.total += firebaseData.bytes;
            currentdata.uploadedBytes.average = currentdata.uploadedBytes.total / currentdata.uploadedBytes.count;

            currentdata.writeSpeed.count++;
            currentdata.writeSpeed.totalExecutionTime += firebaseData.millis;
            currentdata.writeSpeed.avgExecutionTime = currentdata.writeSpeed.totalExecutionTime / currentdata.writeSpeed.count;
        } else if (firebaseData.name === 'concurrent-connect') {
            currentdata.connectSpeed.count++;
            currentdata.connectSpeed.totalExecutionSpeed += firebaseData.millis;
            currentdata.connectSpeed.avgExecutionSpeed = currentdata.connectSpeed.count / currentdata.connectSpeed.totalExecutionSpeed;

        } else if (firebaseData.name === 'concurrent-disconnect') {
            currentdata.disconnectSpeed.count++;
            currentdata.disconnectSpeed.totalExecutionSpeed += firebaseData.millis;
            currentdata.disconnectSpeed.avgExecutionSpeed = currentdata.disconnectSpeed.count / currentdata.disconnectSpeed.totalExecutionSpeed;
        }
    }
}

interface IFirebaseProfiler {
    path: string[];
    millis: number;
    bytes: number;
    name: string;
    timestamp: number;
}

export interface IAnalyzedData {
    childs: IAnalyzedDataTree;

    // listener-broadcast
    broadcastSpeed: {
        count: number;
        totalExecutionTime: number;
        avgExecutionTime: number;
        avgPendingTime: number; // je ne sais pas comment calculer ca
    };
    connectSpeed: {
        path: string;
        count: number;
        avgExecutionSpeed: number;
        avgPendingTime: number;
        totalExecutionSpeed: number;
    };
    disconnectSpeed: {
        path: string;
        count: number;
        avgExecutionSpeed: number;
        avgPendingTime: number;
        totalExecutionSpeed: number;
    };
    downloadedBytes: {
        total: number;
        count: number;
        average: number;
    };
    uploadedBytes: {
        total: number;
        count: number;
        average: number;
    };
    writeSpeed: {
        count: number;
        totalExecutionTime: number;
        avgExecutionTime: number; // je ne sais pas comment calculer ca avec les stats
        avgPendingTime: number; // je ne sais pas comment calculer ca
        permissionDenied: number;
    };
    readSpeed: {
        count: number;
        totalExecutionTime: number;
        avgExecutionTime: number; // je ne sais pas comment calculer ca avec les stats
        avgPendingTime: number; // je ne sais pas comment calculer ca
        permissionDenied: number;
    }
    unindexedQueries: {
        path: string;
        index: string;
        count: number;
    }
}

export interface IAnalyzedDataTree {
    [nodeName: string]: IAnalyzedData
}
