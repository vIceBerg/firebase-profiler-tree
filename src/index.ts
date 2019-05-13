import { DataAnalyzer, IAnalyzedDataTree, IAnalyzedData } from './data-analyzer';

export class Index {
    private _analyzeFileButton: HTMLElement;
    private _firebaseProfilerFile: HTMLInputElement;
    private _treeRootDiv: HTMLElement;

    private _currentFile: File;
    private _analyzedData: IAnalyzedDataTree;

    constructor() {
        this._analyzeFileButton = document.getElementById('analyzeFileButton');
        this._treeRootDiv = document.getElementById('treeRoot');
        this._firebaseProfilerFile = document.getElementById('firebaseProfilerFile') as HTMLInputElement;

        this._analyzeFileButton.onclick = (ev: MouseEvent) => this.onAnalyzeFileClick(ev);
        this._firebaseProfilerFile.onchange = (ev: Event) => this.onFirebaseProfilerFileChange(ev);
    }
    public onAnalyzeFileClick(ev: MouseEvent) {
        if (this._currentFile) {
            const reader = new FileReader();
            reader.onload = (ev: ProgressEvent) => {
                const data = (ev.target as any).result.split('\n');
                const dataAnalyzer = new DataAnalyzer();
                this._analyzedData = dataAnalyzer.analyseData(data);
                this.buildTree(this._treeRootDiv, this._analyzedData);
            };
            reader.readAsText(this._currentFile);
            return;
        }
    }
    public onFirebaseProfilerFileChange(ev: Event) {
        const file = (ev.target as any).files[0];
        this._currentFile = file;
    }

    private buildTree(parentDom: HTMLElement, tree: IAnalyzedDataTree) {
        const childElements = parentDom.getElementsByClassName('tree');
        if (childElements.length != 0) {
            parentDom.removeChild(childElements[0]);
        }

        const innerTree = document.createElement("div");
        innerTree.className = "tree"

        const treeKeyOrdered = Object.keys(tree).sort();
        for (const treeKey of treeKeyOrdered) {
            const leafData = tree[treeKey];
            const leafElement = this.createLeaf(treeKey, leafData);
            innerTree.appendChild(leafElement);
        }
        parentDom.appendChild(innerTree);
    }

    private createLeaf(key: string, leafData: IAnalyzedData): HTMLElement {
        const leafElement = document.createElement("div");
        leafElement.className = 'leaf';

        const leafLabelElement = document.createElement("span");
        leafLabelElement.className = "label";
        leafLabelElement.innerHTML = key;

        const leafStatElement = document.createElement('span');
        let statsText = ` B: ${leafData.broadcastSpeed.count}/${leafData.broadcastSpeed.totalExecutionTime}`;
        statsText += ` D: ${leafData.downloadedBytes.count}/${leafData.downloadedBytes.total}`;
        statsText += ` U: ${leafData.uploadedBytes.count}/${leafData.uploadedBytes.total}`;
        statsText += ` W: ${leafData.writeSpeed.count}/${leafData.writeSpeed.totalExecutionTime}`;
        statsText += ` R: ${leafData.readSpeed.count}/${leafData.readSpeed.totalExecutionTime}`;
        leafStatElement.innerHTML = statsText;

        const leafButtonElement = document.createElement("button");
        leafButtonElement.innerHTML = "+";
        leafButtonElement.onclick = () => this.expandLeaf(leafData, leafElement);

        const leafTreeElement = document.createElement("div");
        leafTreeElement.className = "tree";

        if (leafData.childs && Object.keys(leafData.childs).length > 0) {
            leafElement.appendChild(leafButtonElement);
        }
        leafElement.appendChild(leafLabelElement);
        leafElement.appendChild(leafStatElement);
        leafElement.appendChild(leafTreeElement);

        return leafElement;
    }

    private expandLeaf(leafData: IAnalyzedData, leafElement: HTMLElement) {
        if (!leafData.childs) return;
        this.buildTree(leafElement, leafData.childs);

        const button = leafElement.getElementsByTagName("button")[0];
        button.onclick = () => this.collapseLeaf(leafData, leafElement);
        button.innerHTML = "-";
    }
    private collapseLeaf(leafData: IAnalyzedData, leafElement: HTMLElement) {
        const childElements = leafElement.getElementsByClassName('tree');
        if (childElements.length != 0) {
            leafElement.removeChild(childElements[0]);
        }

        const button = leafElement.getElementsByTagName("button")[0];
        button.onclick = () => this.expandLeaf(leafData, leafElement);
        button.innerHTML = "+";
    }
}

new Index();