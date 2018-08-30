class Highlighter
{
    
    constructor(options)
    {   
        this.items = [];
        this.options = {};
        this.options = options;
        this.selectItem = {};
        this.selectedItemList = [];
        this.content = {
            text : this.options.highlighterContainer.innerText,
            length : this.options.highlighterContainer.innerText.length
        };
        this.itemsRander();
        
        this.options.highlighterContainer.addEventListener('mouseup',this.highlightEvent.bind(this));
        this.options.saveBtn.addEventListener('click',this.saveItems.bind(this));
    }

    httpRequest(httpOptions)
    {
        return new Promise((resolve, reject)=>{
            
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.response);
            }
            };
            xhttp.open(httpOptions.method, httpOptions.url, true);
            if (httpOptions.method == 'post') {
                var params = Object.keys(httpOptions.data).map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
                }).join('&');
                xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            xhttp.send();
            
        })
    }

    itemsRander()
    {
        /* this.httpRequest({
            method : 'get',
            url : 'https://apibinssoft.herokuapp.com'
        }).then((responseData)=>{
            console.log(responseData);
        }) */
        this.items = [
            {
                id : 1,
                name : 'Item 1',
                color : '#DB7093',
                subItems : [
                    {
                        id : 10,
                        name : 'Item 1 - 1',
                        color : '#ba1046',
                    },
                    {
                        id : 11,
                        name : 'Item 1 - 2',
                        color : '#996b79',
                    },
                ]
            },
            {
                id : 2,
                name : 'Item 2',
                color : '#008000',
                subItems : [
                    {
                        id : 12,
                        name : 'Item 2 - 1',
                        color : '#276627',
                    },
                    {
                        id : 13,
                        name : 'Item 2 - 2',
                        color : '#06db06',
                    },
                ]
            },
            {
                id : 3,
                name : 'Item 3',
                color : '#FF6347',
                subItems : []
            },
            {
                id : 4,
                name : 'Item 4',
                color : '#6495ED',
                subItems : []
            },
            {
                id : 5,
                name : 'Item 5',
                color : '#C0C0C0',
                subItems : []
            },
            {
                id : 6,
                name : 'Item 6',
                color : '#F4A460',
                subItems : []
            },
            {
                id : 7,
                name : 'Item 7',
                color : '#008080',
                subItems : []
            },
            {
                id : 8,
                name : 'Item 8',
                color : '#FF6347',
                subItems : []
            },

        ];
        if (this.items.length > 0) {
            for (let item of this.items) {
                let itemName = item.name;
                let itemId  = item.id;
                let itemColor = item.color;

                let span = document.createElement('span');
                span.setAttribute('class', 'selector-item');
                span.setAttribute('data-id', itemId);
                span.setAttribute('data-color', itemColor);
                span.addEventListener('click',this.clickItemEvent.bind({item:item, obj:this}))

                let colorI = document.createElement('i');
                colorI.setAttribute('class','color-icon');
                colorI.setAttribute('style','background-color:'+itemColor);
                span.appendChild(colorI);

                let textEm = document.createElement('em');
                textEm.appendChild(document.createTextNode(itemName));
                span.appendChild(textEm);

                this.options.itemContainer.appendChild( span );
            }
        }
    }
    clickItemEvent(event)
    {
        const selectItem = this.item;
        let item = document.querySelector('[data-id="'+selectItem.id+'"]');
        var allItemPromise = [];
        const allSelectElement = document.getElementsByClassName('selector-item');

        [].forEach.call(allSelectElement, function(el) {
            allItemPromise.push(new Promise((resolve, reject)=>{
                el.classList.remove("active");
                resolve();
            }))
            
        });
        Promise.all(allItemPromise).then(()=>{
            item.classList.add('active');
            this.obj.selectItem = selectItem;
        })
        
    }
    clickSubItemEvent()
    {
        const wrapItem = this.wrapItem;
        console.log(wrapItem);
        wrapItem.setAttribute('data-item', this.item.id);
        wrapItem.setAttribute('data-color', this.item.color);
        wrapItem.setAttribute('style', "background-color:"+this.item.color);
        document.getElementById('subitemmodal').classList.add('hidden');
    }
    highlightEvent()
    {
        var obj = this;
		var sel, range, node; 
		if (Object.keys(obj.selectItem).length >0) {

        
            if (window.getSelection) {
                sel = window.getSelection();
                new Promise((resolve, reject)=>{
                    if(!(/^\s/).test(sel.getRangeAt(0).toString())) {
                    
                        if (!sel.isCollapsed) {
            
                            // Detect if selection is backwards
                            var range = document.createRange();
                            range.setStart(sel.anchorNode, sel.anchorOffset);
                            range.setEnd(sel.focusNode, sel.focusOffset);
                            var backwards = range.collapsed;
                            range.detach();
                
                            // modify() works on the focus of the selection
                            var endNode = sel.focusNode, endOffset = sel.focusOffset;
                            sel.collapse(sel.anchorNode, sel.anchorOffset);
                            
                            var direction = [];
                            if (backwards) {
                                direction = ['backward', 'forward'];
                            } else {
                                direction = ['forward', 'backward'];
                            }
                
                            sel.modify("move", direction[0], "character");
                            sel.modify("move", direction[1], "word");
                            sel.extend(endNode, endOffset);
                            sel.modify("extend", direction[1], "character");
                            sel.modify("extend", direction[0], "word");
                        }
                    }
                    resolve(sel);
                }).then((sel)=>{
                    
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        
                        if(range.startOffset != range.endOffset && range.toString().trim()!=''){
                            
        
                            var current = {
                                "color" : obj.selectItem.color,
                                "dataItem" : obj.selectItem.id
                            }
                            obj.wraper(range,current);
                            
                            //$(obj.selector).find('i.cross').bind('click',{obj:obj}, obj.removeStyle);
                            if(range.commonAncestorContainer.nodeName == 'SPAN') {
                                this.splitNode(range.commonAncestorContainer);
                            }
                            
                        }
                    }
                    obj.clearSelection();
                })

                
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                range.collapse(false);
                range.pasteHTML(html);
                obj.clearSelection();
            }
        } else {
            obj.clearSelection();
        }
    }
    clearSelection()
	{
	 if (window.getSelection) {window.getSelection().removeAllRanges();}
	 else if (document.selection) {document.selection.empty();}
    }
    splitNode(node) {
        let iEle = node.getElementsByTagName('i');
        node.removeChild( iEle[iEle.length-1] );
        var nodeInnerHtml = node.innerHTML;
        var leftPart = nodeInnerHtml.substr(0, nodeInnerHtml.indexOf('<span'));
        var childHtml = node.getElementsByTagName('span')[0];
        var rightPart = nodeInnerHtml.substr(nodeInnerHtml.indexOf('</span>')+7);
        var current = {
            "color" : node.getAttribute('data-color'),
            "dataItem" : node.getAttribute('data-item')
        }
        var div = document.createElement('div');
        div.appendChild(this.wraper(leftPart,current));
        div.appendChild(childHtml)
        div.appendChild(this.wraper(rightPart,current));
        node.outerHTML = div.innerHTML;

        let elementsArray = this.options.highlighterContainer.querySelectorAll('span.select-text');
        
        let classObj = this;
        elementsArray.forEach(function(elem) {
            let clickItem = {               
                color : elem.getAttribute('data-color'),
                dataItem : elem.getAttribute('data-item')
            }
            elem.querySelector('i.cross').addEventListener('click',classObj.removeItem.bind(classObj));
            elem.addEventListener('click', classObj.addSubItem.bind({item:clickItem, obj:classObj}));
        });
        
      }
    wraper(range,current)
	{
		var wrapItem = document.createElement("span");
        wrapItem.setAttribute('style',"background-color:"+current.color);
        wrapItem.classList.add('select-text')
        wrapItem.setAttribute('data-item',current.dataItem);
        wrapItem.setAttribute('data-color',current.color);
    	if(typeof range == 'object'){
	    	range.surroundContents(wrapItem);
	    } else {
	    	wrapItem.innerHTML = range;
        }
        wrapItem.addEventListener('click', this.addSubItem.bind({item:current, wrapItem: wrapItem,  obj:this}));
    	var cross = document.createElement('i');
        cross.setAttribute('class',"cross cross-icon");
        cross.addEventListener('click', this.removeItem.bind(this))
    	wrapItem.appendChild(cross);
    	return wrapItem;
    }
    addSubItem()
    {
        const modelContainer = document.getElementById('subitemmodal');
        modelContainer.classList.remove('hidden');
        const wrapItem = this.wrapItem;
        var clickedItem = this.item;
        var subItems = this.obj.items.find((i)=>{
            return i.id == parseInt(clickedItem.dataItem)
        })
        subItems = subItems.subItems;
        var container = modelContainer.getElementsByClassName('modal-custom-container')[0];
        container = container.getElementsByClassName('modal-content')[0];
        container.innerHTML = '';
        if (subItems.length > 0) {
            for(let item of subItems) {
                var itemDiv = document.createElement('div');
                itemDiv.classList.add('sub-item-container');
    
                let span = document.createElement('span');
                span.setAttribute('class', 'selector-item');
                span.setAttribute('data-id', item.id);
                span.setAttribute('data-color', item.color);
                
                span.addEventListener('click',this.obj.clickSubItemEvent.bind({item:item, wrapItem: wrapItem,  obj:this.obj}))
    
                let colorI = document.createElement('i');
                colorI.setAttribute('class','color-icon');
                colorI.setAttribute('style','background-color:'+item.color);
                span.appendChild(colorI);

                let textEm = document.createElement("em");
                textEm.appendChild(document.createTextNode(item.name));
                span.appendChild(textEm);
    
                itemDiv.appendChild(span);
                container.appendChild(itemDiv);
            }
        } else {
            let itemDiv = document.createElement('div');
            itemDiv.classList.add('no-item-exists');
            itemDiv.appendChild(document.createTextNode('No Sub Item exist'));
            container.appendChild(itemDiv);
        }
        
        document.getElementsByClassName('close-modal')[0].addEventListener('click',()=>{
            modelContainer.classList.add('hidden');
        })
    }
    removeItem() {
        var wrap = event.target.parentElement;
        if (wrap){
            wrap.removeChild( wrap.getElementsByTagName('i')[0] );
            var text = wrap.innerText;
            if (text){
                wrap.outerHTML = text;
            }
        }
		event.stopPropagation();
	}
    
    getSelectedItems(){
        this.selectedItemList =[];
		var childNodes = this.options.highlighterContainer.childNodes;
		var startPoint = 0;
		for(let child of childNodes) {
			startPoint += (child.innerText)? child.innerText.length : child.length;
			if(child.nodeName == 'SPAN') {
				let start = (startPoint - child.innerText.length);
				if(/^\s/.test(child.innerText)) {
					start += 1;
				}
				let selectText = child.innerText.trim();
				
				this.selectedItemList.push({
					text : selectText,
					item : parseInt(child.getAttribute('data-item')),
					start :  start,
					length : selectText.length
				})
			}
		}
		console.log(this.selectedItemList);
    }
    
    saveItems()
    {
        this.getSelectedItems();
    }
}

$(()=>{
    const options = {
        'itemContainer' : document.getElementById("itemContainer"),
        'highlighterContainer' : document.getElementById("highlighterContainer"),
        'saveBtn': document.getElementById('saveItemBtn')
    }
    const highlighterObj = new Highlighter(options);
})