//
// Attention: This file is generated once and can be modified by hand
// Generated by: pageBBview.js.vsl in andromda-backbone-js-ui cartridge.
// individualApplication
// gov.hhs.cms.ffe.ee.web.individualApplicationNew
// webNew
//
var IndividualApplication_FAHAddPersonModalBBView = FFEView.extend({
	// The el property is the root element of the view.
	// You can only bind to events fired in this element or its children.
	el : $("#fahAddPersonModalContainer"),

	// The "model" attribute is the one that the model binding library uses
	model : individualApplicationApplicationBBModel,
	callingEvent : null,
	callingView : null,
	memberList : null,
	callbackFunction : null,
	
	// Underscore.js template variables points to the template in the XHTML
	// file. There can be more than one template.
	modalTemplate : _.template($('#fahAddPersonModalTemplate').html()),
	addPersonTemplate : _.template($('#fahAddPersonInstanceTemplate').html()),
	suffixDropDownTemplate : _.template($('#suffixDropDownSectionTemplate').html()),

	// Namespace is used for looking up keys in the resource bundle
	namespace : "ffe.ee",
	
	// Page name is used for looking up keys in the resource bundle
	pageName : "individualApplication",
	
	// Variable through which the view can access the resource bundle. 
	resources : resources,

	// Holds a reference to this page's instance of the FFM.FormValidator
    formValidator : null,
	
	// Initialize is always called first when the prototype constructor ("new")
	// is called
	initialize : function() {
		FFEView.prototype.initialize.call(this);
		
		// Generally all methods in the view will require a reference to the
		// "this" context. The Underscore.js bindAll method fixes loss of 
		// context in the bound methods
		_.bindAll(this, 'refreshTemplate', 'cancel', 'save', 'initializeFAHAddPersonModal', 'toggleRadios', 'getIdHelper', 
				'appendAddPersonTemplates','cancelHelper','toggleValidations');
		
		this.model.bind('initializeFAHAddPersonModal', this.initializeFAHAddPersonModal);
		// Custom validation handlers could be added here

		// Initialize generally completes by calling this.render
		this.render();
	},

	// The events object links all UI events in this view with their event
	// handlers
	events : {
		"click #fahAddPersonModalContinueButton" : "save",
		"click .fahAddPersonRadios" : "toggleRadios"
	},
	
	refreshTemplate : function() {
		$('#fahAddPersonModalContainer').empty();
	},
	
	initializeFAHAddPersonModal : function(memberList,callbackFunction) {
		//this.callingEvent = event;
		//this.callingView = callingView;
		this.memberList = memberList;
		this.callbackFunction = callbackFunction;
		
		$('#fahAddPersonModalContainer').empty();
		$('#fahAddPersonModalContainer').append(this.modalTemplate({}));
		
		this.appendAddPersonTemplates();
		this.initializeValidation();
		
		//call common modal initialize method
		initializeDialog('fahAddPersonModalContainer', "", this.resources['ffe.ee.indApp.familyAndHousehold.addPersonModal.addThesePeople']);
		reinitializeDatePickers();
		$('#fahAddPersonModalContainer :radio').customInput();
		$('#fahAddPersonModalContainer').dialog("open");
	},
	
	initializeValidation : function() {
		this.formValidator = new FFM.FormValidator($("#addPersonModal"), $("#fahAddPersonModalContinueButton"));
	},
	
	appendAddPersonTemplates : function() {
		var dob = "";
		
		$('#addPersonContainer').empty();
		
		for (var i = 0; i < this.memberList.length; i++)
		{
			if (!isEmpty(this.memberList[i].birthDate)){
				dob = this.memberList[i].birthDate;
				dob = simpleDateToUIDate(dob);
			}

			$('#addPersonContainer').append(this.addPersonTemplate({
				"memberName" : this.memberList[i].firstName + ' ' + this.memberList[i].lastName,
				"index" : i,
				"birthDate" : dob
			}));
			
			$('#addPersonSuffixBlock' + i).empty();
			$('#addPersonSuffixBlock' + i).append(this.suffixDropDownTemplate({
				"labelToUse" : this.resources['ffe.ee.indApp.gettingStarted.contactInfo.suffixName'],
				"idToUse" : "addPersonSuffix" + i,
				"nameToUse" : "",
				"forToUse" : "addPersonSuffix" + i,
				"isRequired" : false
			}));
			
			if (!isEmpty(this.memberList[i].firstName))
			{
				$('#addPersonFirstName' + i).val(this.memberList[i].firstName);
			}
			
			if (!isEmpty(this.memberList[i].middleName))
			{
				$('#addPersonMiddleName' + i).val(this.memberList[i].middleName);
			}
			
			if (!isEmpty(this.memberList[i].lastName))
			{
				$('#addPersonLastName' + i).val(this.memberList[i].lastName);
			}
			
			if (!isEmpty(this.memberList[i].suffixName))
			{
				$('#addPersonSuffix' + i).val(this.memberList[i].suffixName);
			}
			
			if (!isEmpty(dob))
			{
				$('#addPersonDOB' + i).val(dob);
			}
			
			//add validation
		}
	},
	
	cancel : function(event) {
		this.cancelHelper(false);
	},
	
	cancelHelper : function(performCallback) {
		$('#fahAddPersonModalContainer').dialog("close");
		$('#fahAddPersonModalContainer').empty();
		
		if (performCallback!==undefined) {
			if (typeof this.callbackFunction === "function") {
				this.callbackFunction(this.memberList,performCallback);
			}
		}
	},

	save : function() {
		if (this.saveDataFromModal()) {
			this.cancelHelper(true);
		}
		else {
			this.cancelHelper(false);
		}
		
	},
	
	saveDataFromModal : function() {
		var dob = "";
		var listLength = this.memberList.length;
		var keepMembersList = [];
		var noCancelMember = true;
		
		for (var i = 0; i < listLength; i++)
		{
			if (isRadioButtonSelected('addPersonNo' + i))
			{
				this.memberList[i].status = 'Change';
				this.memberList[i].firstName = $('#addPersonFirstName' + i).val();
				this.memberList[i].middleName = $('#addPersonMiddleName' + i).val();
				this.memberList[i].lastName = $('#addPersonLastName' + i).val();
				this.memberList[i].suffixName = $('#addPersonSuffix' + i).val();
				dob = uiDateToSimpleDate($('#addPersonDOB' + i).val());
				this.memberList[i].birthDate = dob;
				keepMembersList.push(this.memberList[i]);
			}
			else if (isRadioButtonSelected('addPersonYes' + i))
			{
				this.memberList[i].status = 'Keep';
				keepMembersList.push(this.memberList[i]);
			}
			else if (isRadioButtonSelected('addPersonCancel'+i)){
				noCancelMember = false;
			}
		}
		
		this.memberList = keepMembersList;
		
		console.log(this.memberList);
		
		return noCancelMember;
	},
	
	toggleValidations : function(toggle,index) {
		if (toggle) { // add validation
			addFormValidationToField(this.formValidator, 'addPersonFirstName'+index, 'notBlank eeName');
			addFormValidationToField(this.formValidator, 'addPersonMiddleName'+index, 'eeName');
			addFormValidationToField(this.formValidator, 'addPersonLastName'+index, 'notBlank eeName');
			addFormValidationToField(this.formValidator, 'addPersonDOB'+index, 'notBlank eeUIDate');
            addFormValidationToField(this.formValidator, 'addPersonFieldset' + index, 'notDuplicateName');
		}
		else { // remove validation
			removeFormValidationFromField(this.formValidator,'addPersonFirstName'+index);
			removeFormValidationFromField(this.formValidator,'addPersonMiddleName'+index);
			removeFormValidationFromField(this.formValidator,'addPersonLastName'+index);
			removeFormValidationFromField(this.formValidator,'addPersonDOB'+index);
            removeFormValidationFromField(this.formValidator, 'addPersonFieldset' + index);
		}
	},
	
	toggleRadios : function(event) {
		toggleCustomRadioGroup(event);
		var id = this.getIdHelper(event);
		var index = getIndexFromEventObj(event);
		
		if ($('#' + id).val() === 'No')
		{
			//show fields
			$('#addPersonInfoBlock' + index).show();
			
			//add validations
			this.toggleValidations(true, index);
		}
		else
		{
			//hide fields
			$('#addPersonInfoBlock' + index).hide();
			
			//remove validations
			this.toggleValidations(false, index);
		}
	},
	
	getIdHelper : function(input) {
		if ($.type(input) === 'string')
		{
			return input;
		}
		else
		{
			return getIdFromEvent(input);
		}
	}
	
});
var individualApplicationFAHAddPersonModalBBView = new IndividualApplication_FAHAddPersonModalBBView();
