// BUDGET CONTROLLER
const budgetController = (function() {
	// Expense
	const Expense = function(id,desc,val){
		this.id 	= id;
		this.desc 	= desc;
		this.val 	= val;
	};
	// Income
	const Income = function(id,desc,val){
		this.id 	= id;
		this.desc 	= desc;
		this.val 	= val;
	};
	let calculateTotal = (type)=>{
		let sum = 0;
		data.allItems[type].forEach(function(curr){
			sum += curr.val;
		});
		data.totals[type] = sum;
	}

	const data = {
		allItems:{
			exp: [],
			inc: []
		},
		totals:{
			exp:0,
			inc:0
		},
		budget: 0,
		percentage:-1
	};

	return {
		addItem: function(type,desc,val){
			let newItem,ID;
			// Create NEw ID
			if(data.allItems[type].length >0){
				ID = data.allItems[type][data.allItems[type].length - 1].id+1;
			}else{
				ID =0;
			}
			// Create New item based on 'inc' or 'exp' type  
			if(type ==='exp' ){
				newItem = new Expense(ID,desc, val);
			}else if(type ==='inc' ){
				newItem = new Income(ID,desc, val);
			}
			// push it into our data structure
			data.allItems[type].push(newItem);
			// return the new Element
			return newItem;
		},
		calculateBudget: function(){
			// calculate total income and expenses
				calculateTotal('inc');
				calculateTotal('exp');
			// calculate budget: income -expenses
				data.budget = data.totals.inc - data.totals.exp;
			// calculate the percentage of the income that we spent
			if(data.totals.inc >0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
			}else{
				data.percentage = -1;
			}
		},
		deletetItem: function(type,id){
			let ids,index;
			ids = data.allItems[type].map(function(current){
				return current.id;
			});
			index = ids.indexOf(id);
			if(index !== -1){
				data.allItems[type].splice(index,1);
			}
		},
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},
		getData: function(){
			return data;
		}
	}

})();

// UI CONTROLLER
const UIController	= (function() {
	// DOM Strings
	const DOMStrings = {
		addBtn: '.add__btn',
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputvalue: '.add__value',
		incomeList: '.income__list',
		expensesList: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLavel: '.budget__income--value',
		expensesLavel: '.budget__expenses--value',
		percentageLavel: '.budget__expenses--percentage',
		container:'.container',
		budgetTime:'.budget__title--month',
	}

	// Get and Return inputs
		function addComma(num){
		let numSplit,int,dec,newnum;
		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
		int = numSplit[0];
		dec = numSplit[1];
		if(int.length ===4 || int.length ===5){
			int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,int.length);
		}
		newnum = int+'.'+dec;
		return newnum;
	}
	return {
		getInputs: function(){
			return {
				type: document.querySelector(DOMStrings.inputType),
				desc: document.querySelector(DOMStrings.inputDesc),
				value: document.querySelector(DOMStrings.inputvalue)
			}
		},
		getValues: function(){
			return {
				type: this.getInputs().type.value.trim(),
				desc: this.getInputs().desc.value.trim(),
				value: parseFloat(this.getInputs().value.value.trim())
			}
		},
		addListItem: function(object,type){
			let html,element,value;
			value = addComma(object.val);
			// create html string  with placeholder
			if(type=== 'inc'){
				element = DOMStrings.incomeList;
				html = `<div class="item clearfix" id="inc-${object.id}"><div class="item__description">${object.desc}</div><div class="right clearfix"><div class="item__value">$${value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

			} else if(type==='exp'){
				element = DOMStrings.expensesList;
				html =`<div class="item clearfix" id="exp-${object.id}"><div class="item__description">${object.desc}</div><div class="right clearfix"><div class="item__value">-${value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			}


			// Replace the place holder with actual Data
			//newHtml = html.replace('%id%',object.id);
			//newHtml = newHtml.replace('%description%',object.desc);
			//newHtml = newHtml.replace('%value%',object.val);

			//insert the html into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',html);
		},
		deleteListItem: function(selectorID){
			let el;
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		clearFields: function(){
			let fields, newFields;
			fields = document.querySelectorAll(DOMStrings.inputDesc+','+DOMStrings.inputvalue);
			newFields = Array.prototype.slice.call(fields);
			newFields.forEach((current,index,array)=>{
				current.value = '';
			});
			newFields[0].focus();
		},
		displayBudget: function(objects){
			let budget;
			if(objects.budget>0){
				budget = addComma(objects.budget);
				document.querySelector(DOMStrings.budgetLabel).textContent = `+ ${budget}$`;
			}else{
				budget = addComma(objects.budget);
				document.querySelector(DOMStrings.budgetLabel).textContent = ` ${objects.budget}$`;
			}
			document.querySelector(DOMStrings.incomeLavel).textContent = `+ ${objects.totalInc}$`;
						document.querySelector(DOMStrings.expensesLavel).textContent = `- ${objects.totalExp}$`;
			if(objects.percentage>0){
				document.querySelector(DOMStrings.percentageLavel).textContent = `${objects.percentage}%`;
		}else{
			document.querySelector(DOMStrings.percentageLavel).textContent = '---';
		}
		},
		getDOMStrings: function() {
			return DOMStrings;
		}
	}
	
})();

// GLOBAL APP CONTROLLER
const controller = (function(BudgetCtrl, UICtrl) {
	// Event Handler
	const setupEventListeners = function() {
		const DOM = UICtrl.getDOMStrings();
		document.querySelector(DOM.addBtn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});
		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		const date 		= new Date();
		const months 	= ["January", "February", "March", "April", "May", "June", "July", "August", "September",	 "October", "November", "December"];
		document.querySelector(DOM.budgetTime).innerHTML = `${months[date.getMonth()]}  ${date.getFullYear()}`;
	};

	const upadateBudget = function(){
		let budget, lavelData;
		//1. Calculate the budget
		BudgetCtrl.calculateBudget(); 
		//2. Return the budget 
		budget = BudgetCtrl.getBudget();
		//3. Display thre budget UI
		UICtrl.displayBudget(budget);
	};
	const updatePercentages = function (){

	};
	// CONTROL ADD ITEM
	const ctrlAddItem = function(){
		let newItem,values;
		//1. Get the field values data
		inputs = UICtrl.getInputs();
		values = UICtrl.getValues();
		if(values.desc !=="" && !isNaN(values.value) && values.value >0){
			inputs.desc.style.borderColor='';
			inputs.value.style.borderColor='';
			//2. add ther item to the budget controller 
			newItem = BudgetCtrl.addItem(values.type, values.desc, values.value);
			//3. add the item to the UI Controller
			UICtrl.addListItem(newItem,values.type);
			//4. Clear fields
			UICtrl.clearFields();
			//5. Calculate and update budget on the UI
			upadateBudget();
		}else {
			if ((values.desc ==="" && isNaN(values.value)) || ( values.desc ==="" && values.value===0)) {
				inputs.desc.style.borderColor='red';
				inputs.value.style.borderColor='red';
				inputs.desc.focus();
			}else{
				 if (values.desc ==="") {
					inputs.desc.style.borderColor='red';
					inputs.value.style.borderColor='#e7e7e7';
					inputs.desc.focus();
				}else if (isNaN(values.value) || values.value ===0) {
					inputs.desc.style.borderColor='#e7e7e7';
					inputs.value.style.borderColor='red';
					inputs.value.focus();
				}
			}

		}
	};
	const ctrlDeleteItem = function(event){
		let itemID,splitID,type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID = itemID.split('-');
			type 	= splitID[0];
			ID  	= parseInt(splitID[1]);
			//1. delete the item from the data structure 
			BudgetCtrl.deletetItem(type,ID);
			//2. delete the item from UI
			UICtrl.deleteListItem(itemID);
			// 3. update the new budget and display it
			upadateBudget();
		}
	}
	return {
		init: function(){
			console.log('Application has started!');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		 	setupEventListeners();

		}
	};

})(budgetController,UIController);

controller.init(); 



