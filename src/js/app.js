App={
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function()
    {
        console.log("App is INitializzed");
        var voteFor = document.getElementById('candidateNameId');
         $("#btn_goTo_registration").click(function(){ // On Click on Registration Continue button  to go registration page
          location.href = "registration.html";
         });
         $("#btn_goTo_voting").click(function(){ // On Click on Voting Start  button  to go voting page 
          location.href = "index.html";
         });


       
        return App.initWeb3();
    },
    initWeb3: function(){ // Initialize web3 Connector like metamask or some others

        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
          }
          return App.initContracts();
        },
      // Initialize Contracts
        initContracts: function() {
          $.getJSON("Voting.json", function(voting) {
            App.contracts.Voting = TruffleContract(voting);
            App.contracts.Voting.setProvider(App.web3Provider);
            App.contracts.Voting.deployed().then(function(Voting) {
              console.log("Votting Contract  Address :", Voting.address);
            });
          // }).done(function() {
          //   $.getJSON("Voting.json", function(voters) {
          //     App.contracts.Voting = TruffleContract(voters);
          //     App.contracts.Voting.setProvider(App.web3Provider);
          //     App.contracts.Voting.deployed().then(function(voters) {
          //       console.log("Dapp Token Address:", voters.address);
          //     });
      
              return App.render();
            });
         // })
        },
      
      
    render: function(){

     var votingToken;

     // Add Hyphen between number of CNIC No
      $('#cnic').keydown(function(){
        if (event.keyCode == 8 || event.keyCode == 9 
                          || event.keyCode == 27 || event.keyCode == 13 
                          || (event.keyCode == 65 && event.ctrlKey === true) )
                              return;
        var length = $(this).val().length;             
        if(length == 5 || length == 13)
         $(this).val($(this).val()+'-');
       });
      
       // Remove Error class on Click and Reset
       $('#name').click(function(){
        $('#name').removeClass('error');

       })
       $('#selectCandType').click(function(){
        $('#selectCandType').removeClass('error');

       })
       $('#selectEdu').click(function(){
        $('#selectEdu').removeClass('error');

       })
       $('#cnic').click(function(){
        $('#cnic').removeClass('error');

       })
       $('#selectDistrict').click(function(){
        $('#selectDistrict').removeClass('error');

       })
       $('#selectUC').click(function(){
        $('#selectUC').removeClass('error');

       })
       $('#dob').click(function(){
        $('#dob').removeClass('error');

       })
       
       

       
       
      // On Click Registered Function then
    $("#btn_registered").click(function(){
     alert("Wow You are Clicked");
     console.log("Registration button is clicked Am i Right");
     var name = $('#name').val();
     var selectedCandidate = $('#selectCandType').children("option:selected").val();
     var selectEduc = $('#selectEdu').children('option:selected').val();
     var cnic = $('#cnic').val();
     var selectDistrict = $('#selectDistrict').children('option:selected').val().toString();
    //  alert("Distric is : "+selectDistrict);
     var selectUC = $('#selectUC').children('option:selected').val();
     var dob = $('#dob').val();
     
     var ageDifMs;

     // Validate Registration Field before sending to contract
     if(!name.match(/^[a-zA-Z ]{2,30}$/)){
      $('#name').addClass('error');
      return;
      // name.innerHtml="please Enter Correct Name"; 
    }
    if(selectedCandidate == "")
    {
      $('#selectCandType').addClass('error');
      return;
    }
    if(selectEduc == ""){
      $('#selectEdu').addClass('error');
      return;
    }
    if(!cnic.match(/^[1-9-]{15}$/)){
      $('#cnic').addClass('error');
      return;
    }
    else{
       cnic=cnic.replace(/-/gi,"");
      // alert("CNIC Without Hyphen: "+cnic);
    }
    if(selectDistrict == "")
    {
      $('#selectDistrict').addClass('error');
      return;
    }
    if(selectUC == "")
    {
      $('#selectUC').addClass('error');
      return;
    }
    if(dob == ""){
      alert("Why Show DoB Error");
      $('#dob').addClass('error');
      return;
    }
    else{
      
     // Change Date of Birth into seconds
     var birthDate = new Date(dob);
    //  alert("DATE of Birth: "+ birthDate.getTime());
    //  alert("Now Date is: "+ Date.now());
     ageDifMs = Date.now() - birthDate.getTime();
    //  var ageDate = new Date(ageDifMs); // miliseconds from epoch
    //  alert("DATE Of BIRTH in MS: "+ ageDifMs);
    }
    
    if(selectedCandidate == "voter"){


    // Deploy or Registered User on smart Contract
      App.contracts.Voting.deployed().then(function(instance){
        votingToken = instance;
        return votingToken.checkVotersRegistered();
        
      }).then(function(registered){
        alert("Check the Status: "+ registered );
        console.log("Check the Status: "+ registered);
         if(registered ==true) {
           console.log("You already Registered \n as a Voter \n Thanks");
           alert("You already Registered \n as a Voter \n Thanks");
           return;
         }
        return votingToken.voterRegistration(name,ageDifMs,cnic,selectDistrict,selectUC,selectEduc);
        //                              }).then(function(voters){
        // if(voters == true){
        //   console.log("You are Successfully Registered as a Voter ");
        //   alert("You are Successfully Registered as a Voter");
        // }
        // else{
        //   console.log('You are Already Registerd as a Voter \n Thanks');
        //   alert("You are Already Registerd as a Voter \n Thanks");
        // }
      });
                                                                }
      else
        {
          App.contracts.Voting.deployed().then(function(instance){
            votingToken = instance;
            return votingToken.checkIsRegistered();
          }).then(function(registered){
            alert("Check the Status: "+ registered );
            console.log("Check the Status: "+ registered);
            if(registered)
            {
              console.log("You already registered as a Candidate\n Thanks");
              alert("You already registered as a Candidate\n Thanks");
              return;
            }
          
            return votingToken.candidateRegistration(name,selectEduc,cnic,ageDifMs,selectDistrict,selectUC);
            console.log("You are Successfully Registered");
                                                              });
                                                              // .then(function(candi){
                              // if(candi == true){
                              //   console.log("You are Successfully Registered as a Candidate ");
                              //   alert("You are Successfully Registered as a Candidate ");
                              // }
                              // else{
                              //   console.log("You are Already Registerd as a Candidate \n Thanks");
                              //   alert("You are Already Registerd as a Candidate \n Thanks");
                              // }
                            // });
      }
    

    //  alert(dob);
    });
    var btnVote = $('#btn_submitVote');
    btnVote.click(function(){ // check btn vote is working or not

        alert(" Registration is Continued!!!\n \b\bPlease Registered First!!!! \n if You already Registered than Wait for Voting Pool Start!!\n thanks!!");
    });

    }

}

$(function() {
    jQuery(window).on('load',function() {
        App.init();
    });
});










