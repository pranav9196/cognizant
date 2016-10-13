//api url
var api_url = "http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page=1";
// img api url
var img_url ="http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_compiler_image";
// global variables
var images = [];
var languages = {};
var levels = {};
      var total_submission=0;
var submissions_stat = {};
//image fetch
$.getJSON(img_url, function(data)
{
  $.each(data, function(index, value)
  {
    images.push(value["icon"]);
  });
});



//data fetch
$.getJSON(api_url, function(data) {

  var websites= data["websites"];

  var id = 1;
    // console.log(websites);
    $.each(websites, function(index, value){

      //data manipulation
      var this_title = value["title"];
      var this_language = value["language"];
      var this_submits = value["metadata"].users_attempted; 
      var previous_submits;
      var this_level = value["metadata"].level;

      if (this_title in submissions_stat)
      {
        previous_title_submits = submissions_stat[this_title].Submits;
        submissions_stat[this_title].Submits = previous_title_submits + this_submits; 
      }
      else
      {
       submissions_stat[this_title] = { "ID": this_title, "Submits":  this_submits };
      }      

      total_submission+=this_submits;
 
      if (this_level in levels)
      {
        previous_level_submits = levels[this_level].Submits;
        levels[this_level].Submits = previous_level_submits + this_submits; 
      }
      else
      {
       levels[this_level] = { "ID": this_level, "Submits":  this_submits };
      }      

      if (this_language in languages)
      {
        previous_submits = languages[this_language].Submits;
        languages[this_language].Submits = previous_submits + this_submits; 
      }
      else
      {
       languages[this_language] = { "ID": this_language, "Submits":  this_submits };
      }
      //data manipulation ends

      //dynamically generating cross and acceptance icons
     if(value["compiler_status"]=="Accepted"){
      // value["compiler_status"]=1;
      check="check_circle";
    }
    else
    {
      // value["compiler_status"]=0;
      check="highlight_off";
    }
      // creating lines for DOM manipulation
      line1 = "<div id="+ value["id"] + " class='card card-big'>";
      line2 = "<div class='card-header'>";
      line3 = "<div id='image' class='submission-language-pic'>";
      line4 = "<img src="+ images[id]+">"; 
      line5 = "<div class='submission-heading'>" + value['title'] + "</div></div><div class='card-content'><div class='code'><div class='extra'><div class=''><i class='material-icons'>"+ check+"</i><p class='text-fix'>" + value["compiler_status"] + "</p></div><span class='text-fix'>|</span><div class='text-fix card-language'>" + value["language"] + "</div></div>"
      line6 = "<div class='code-content'>" + value["source_code"] + "</div>";
      line7 = "<div class='card-footer'><div class='footer-content level'>Rating :" + value["metadata"].rating + " </div><div class='footer-content rating'>Level of difficulty :"+value["metadata"].level +" </div> <div class='footer-content attempts'>No. of User attempts :" + value["metadata"].users_attempted + " </div>  </div> ";
      html_str = line1 + line2 + line3  + line4 + line5 + line6 +line7;
      $("div#cardwrap1").append(html_str);
      id ++;
    });
    
    console.log(total_submission);
    console.log(languages);
    console.log(levels);
    console.log(submissions_stat)
    //funny that there are only 4 languages
    $.each(languages,function(index,value){
      line = "<li class='pills'><span class='language'>"+ value["ID"] +"</span>:<span class='language-no'>"+ value["Submits"]  +"</span></li>"
      $("ul#pills").append(line);
    });

    $.each(submissions_stat,function(index,value){
      line = "<p class='submission'>"+value["ID"]+" : "+ value["Submits"] +"</p>";
      $("#top2").append(line);
    });

    $.each(levels,function(index,value){
      line = "<li class='pills pills1'><span class='language'>"+value["ID"]+"</span>:<span class='language-no'>"+ value["Submits"] +"</span></li>";
      $("#levels").append(line);
    });

    line="<div class='card-heading sub total'>Total Submissions:<span>"+ total_submission +"</span></div>";
      $("#total_submission").append(line);

      paginate();

  });



  
function previous(){  
  
    new_page = parseInt($('#current_page').val()) - 1;  
    //if there is an item before the current active link run the function  
    if($('.active_page').prev('.page_link').length==true){  
        go_to_page(new_page);  
    }  
  
}  
  
function next(){  
    new_page = parseInt($('#current_page').val()) + 1;  
    //if there is an item after the current active link run the function  
    if($('.active_page').next('.page_link').length==true){  
        go_to_page(new_page);  
    }  
  
}  
function go_to_page(page_num){  
    //get the number of items shown per page  
    var show_per_page = parseInt($('#show_per_page').val());  
  
    //get the element number where to start the slice from  
    start_from = page_num * show_per_page;  
  
    //get the element number where to end the slice  
    end_on = start_from + show_per_page;  
  
    //hide all children elements of content div, get specific items and show them  
    $('#cardwrap1').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');  
  
    /*get the page link that has longdesc attribute of the current page and add active_page class to it 
    and remove that class from previously active page link*/  
    $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');  
  
    //update the current page input field  
    $('#current_page').val(page_num);  
}  



//pagination code
function paginate(){  

  
    //how much items per page to show  
    var show_per_page = 3;  
    //getting the amount of elements inside content div  
    var number_of_items = $('#cardwrap1').children().length;  
    //calculate the number of pages we are going to have  
    var number_of_pages = 16;  
    console.log(number_of_pages+" "+number_of_items);
    //set the value of our hidden input fields  
    
    $('#current_page').val(1);  
    $('#show_per_page').val(show_per_page);  
  
    //now when we got all we need for the navigation let's make it '  
  
    /* 
    what are we going to have in the navigation? 
        - link to previous page 
        - links to specific pages 
        - link to next page 
    */  
    var navigation_html = '<a class="previous_link" href="javascript:previous();">Prev</a>';  
    console.log(navigation_html);
    var current_link = 0;  
    while(number_of_pages > current_link){  
        navigation_html += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';  
        current_link++;  
    }  
    navigation_html += '<a class="next_link" href="javascript:next();">Next</a>';  
  
    $('#page_navigation').html(navigation_html);  
  
    //add active_page class to the first page link  
    $('#page_navigation .page_link:first').addClass('active_page');  
  
    //hide all the elements inside content div  
    $('#cardwrap1').children().css('display', 'none');  
  
    //and show the first n (show_per_page) elements  
    $('#cardwrap1').children().slice(0, show_per_page).css('display', 'block');  
  }