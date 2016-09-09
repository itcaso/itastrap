(function($) {
    'use strict';
    
    var html = null;
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var resizeHandlers = [];

    $.scrollTo = scrollTo;

    $.initSlimScroll = initSlimScroll;

    $.destroySlimScroll = destroySlimScroll;

    $.getViewPort = getViewPort;

    $.detectorIE = detectorIE;

    $.cargarClima = cargarClima;

    $.mostrarFechaYHora = mostrarFechaYHora;

    $.irArriba = irArriba;

    $.menuSidebar = menuSidebar;

    $.altura_Sidebar_Content = altura_Sidebar_Content;

    $._calculateFixedSidebarViewportHeight = _calculateFixedSidebarViewportHeight;

    $.handleFixedSidebar = handleFixedSidebar;

    $.handleFixedSidebarHoverEffect = handleFixedSidebarHoverEffect;

    $.handleSidebarToggler = handleSidebarToggler;

    $.handleSidebarMenu = handleSidebarMenu;

    $.getResponsiveBreakpoint = getResponsiveBreakpoint;

    $.handleTabs = handleTabs;

    $.handle100HeightContent = handle100HeightContent;

    $.handleMaterialDesign = handleMaterialDesign;

    $.handlePortletTools = handlePortletTools;

       

    var resBreakpointMd = getResponsiveBreakpoint('md');


    /*
    * Funcion para hacer scroll y enfocarse en un elemento
    * @autor: Italo Carlos
    */
    function scrollTo(el, offeset){
      var pos = (el && el.size() > 0) ? el.offset().top : 0;
      var hC_HeaderFixed = $('body').hasClass('page-header-fixed');
      var hC_HeaderTopFixed = $('body').hasClass('page-header-top-fixed');
      var hC_HeaderMenuFixed = $('body').hasClass('page-header-menu-fixed');

      if (el) {
          if (hC_HeaderFixed) {
              pos = pos - $('.page-header').height();
          } else if (hC_HeaderTopFixed) {
              pos = pos - $('.page-header-top').height();
          } else if (hC_HeaderMenuFixed) {
              pos = pos - $('.page-header-menu').height();
          }
          pos = pos + (offeset ? offeset : -1 * el.height());
      }
      $('html,body').animate({
          scrollTop: pos
      }, 'slow');
    }

    /*
    * Inicializar plugin jQuery slimScroll
    * @autor: Italo Carlos
    */
    function initSlimScroll(el){
      $(el).each(function() {
        if ($(this).attr("data-initialized")) {
          return; // exit
        }
        var height;

        if ($(this).attr("data-height")) {
            height = $(this).attr("data-height");
        } else {
            height = $(this).css('height');
        }

        $(this).slimScroll({
            allowPageScroll: true, // allow page scroll when the element scroll is ended
            size: '7px',
            color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
            wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
            railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
            position: isRTL ? 'left' : 'right',
            height: height,
            alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
            railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
            disableFadeOut: true
        });

        $(this).attr("data-initialized", "1");
      });
    }
    
    function destroySlimScroll(el){
      $(el).each(function() {
                if ($(this).attr("data-initialized") === "1") { // destroy existing instance before updating the height
                    $(this).removeAttr("data-initialized");
                    $(this).removeAttr("style");

                    var attrList = {};

                    // store the custom attribures so later we will reassign.
                    if ($(this).attr("data-handle-color")) {
                        attrList["data-handle-color"] = $(this).attr("data-handle-color");
                    }
                    if ($(this).attr("data-wrapper-class")) {
                        attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                    }
                    if ($(this).attr("data-rail-color")) {
                        attrList["data-rail-color"] = $(this).attr("data-rail-color");
                    }
                    if ($(this).attr("data-always-visible")) {
                        attrList["data-always-visible"] = $(this).attr("data-always-visible");
                    }
                    if ($(this).attr("data-rail-visible")) {
                        attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                    }

                    $(this).slimScroll({
                        wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                        destroy: true
                    });

                    var the = $(this);

                    // reassign custom attributes
                    $.each(attrList, function(key, value) {
                        the.attr(key, value);
                    });

                }
            });
    }

    /*
    * Para obtener el ancho correcto del viewport
    * basado en http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
    * @autor: Italo Carlos
    */
    function getViewPort(){
      var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
            
        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
            
        };
        
    }

    // Set proper height for sidebar and content. The content and sidebar height must be synced always.

    /*
    * Funcion que da una altura adecuada al sidebar y al content.
    * La altura del Content y el Sidebar  siempre deben estar sincronizadas.
    * @autor: Italo Carlos (funcion llamada antes handleSidebarAndContentHeight)
    */
    function altura_Sidebar_Content(){
      var content = $('.page-content');
      var sidebar = $('.page-sidebar');
      var body = $('body');
      var height;

      if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
            var available_height = getViewPort().height - $('.page-footer').outerHeight() - $('.page-header').outerHeight();
            if (content.height() < available_height) {
                content.attr('style', 'min-height:' + available_height + 'px');
            }
      } else {
            if (body.hasClass('page-sidebar-fixed')) {
                height = _calculateFixedSidebarViewportHeight();
                if (body.hasClass('page-footer-fixed') === false) {
                    height = height - $('.page-footer').outerHeight();
                }
            } else {
                var headerHeight = $('.page-header').outerHeight();
                var footerHeight = $('.page-footer').outerHeight();

                if (getViewPort().width < resBreakpointMd) {
                    height = getViewPort().height - headerHeight - footerHeight;
                } else {
                    height = sidebar.height() + 20;
                }

                if ((height + headerHeight + footerHeight) <= getViewPort().height) {
                    height = getViewPort().height - headerHeight - footerHeight;
                }
            }
            content.attr('style', 'min-height:' + height + 'px');
      }
    }

    /*
    * Funcion que ayuda a calcular la altula del sidebar
    * cuando esta la opcion 'fixed' del sidebar.
    * @autor: Italo Carlos
    */
    function _calculateFixedSidebarViewportHeight(){
      var sidebarHeight = getViewPort().height - $('.page-header').outerHeight();
      var footerFixed = $('body').hasClass("page-footer-fixed");
      if(footerFixed){
        sidebarHeight = sidebarHeight - $('.page-footer').outerHeight();
      }
      return sidebarHeight;
    }

    /*
    * Funcion que ayuda a manejar el fixed sidebar.
    * cuando esta la opcion 'fixed' del sidebar.
    * @autor: Italo Carlos
    */
    function handleFixedSidebar(){
      var menu = $('.page-sidebar-menu');

      destroySlimScroll(menu);

      if ($('.page-sidebar-fixed').size() === 0) {
          altura_Sidebar_Content();
          return;
      }

      if (getViewPort().width >= resBreakpointMd) {
            menu.attr("data-height", _calculateFixedSidebarViewportHeight());
            initSlimScroll(menu);
            altura_Sidebar_Content();
        }

    }

    /*
    * Funcion para mostrar y ocultar el Sidebar
    * @autor: Italo Carlos
    */
    function handleFixedSidebarHoverEffect(){
      var body = $('body');

      if (body.hasClass('page-sidebar-fixed')) {
          $('.page-sidebar').on('mouseenter', function () {
              if (body.hasClass('page-sidebar-closed')) {
                  $(this).find('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
              }
          }).on('mouseleave', function () {
              if (body.hasClass('page-sidebar-closed')) {
                  $(this).find('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
              }
          });
      }
    }

    /*
    * Funcion para activar el boton de mostrar y ocultar el Sidebar
    * @autor: Italo Carlos
    */
    function handleSidebarToggler(){
      var body = $('body');

      if ($.cookie && $.cookie('sidebar_closed') === '1' && getViewPort().width >= resBreakpointMd) {
          $('body').addClass('page-sidebar-closed');
          $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
      }

      $('body').on('click', '.sidebar-toggler, .sidebar-toggler-logo', function (e) {
          var sidebar = $('.page-sidebar');
          var sidebarMenu = $('.page-sidebar-menu');
          $(".sidebar-search", sidebar).removeClass("open");

          if (body.hasClass("page-sidebar-closed")) {
              body.removeClass("page-sidebar-closed");
              sidebarMenu.removeClass("page-sidebar-menu-closed");
              if ($.cookie) {
                  $.cookie('sidebar_closed', '0');
              }
          } else {
              body.addClass("page-sidebar-closed");
              sidebarMenu.addClass("page-sidebar-menu-closed");
              if (body.hasClass("page-sidebar-fixed")) {
                  sidebarMenu.trigger("mouseleave");
              }
              if ($.cookie) {
                  $.cookie('sidebar_closed', '1');
              }
          }

          $(window).trigger('resize');
      });

    }

    /*
    * Obtener Breakpoints responsivos de bootstrap
    * @autor: Italo Carlos
    * @size: tamaños disponibles en bootrsap
    */

    function getResponsiveBreakpoint(size){
      var sizes = {
        'xs' : 480,     // extra small
        'sm' : 768,     // small
        'md' : 992,     // medium
        'lg' : 1200     // large
      };

      return sizes[size] ? sizes[size] : 0; 
    }

      /**
     * Deteccion del navegador si es Internet Explorer
     * y que version de Internet Explorer es.
     * @author Italo Carlos.
     */
    function detectorIE(){
      if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    }

    /**
   * Carga el clima de la ciudad de Monterrey, tambien tiene
   * una opcion para geolocalizacion que esta comentada.
   * @param location: lugar de donde es el clima
   * @param woeid where onearth identifiers
   * @author Italo Carlos. Funcion de simpleweatherjs.com
   */
    function cargarClima(){
      $.simpleWeather({
        location: 'Monterrey MX',
        woeid: '',
        unit: 'c',
        success: function(weather){
          html = '<div class="city">'+weather.city+', '+weather.country+'</div>';
          html += '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
          html += '<div class="minmax"><span class="min">Min: '+weather.low+'&deg;C</span> / <span class="max">Max: '+weather.high+'&deg;C</span></div>';
          $("#weather").html(html);
        },
        error: function(error) {
          $("#weather").html('<p>'+error+'</p>');
        }
      });
    }

    /*
    * Muestra la Fecha y la hora de la computadora.
    * @autor: Italo Carlos
    */
    function mostrarFechaYHora(){
      var miDia = new Date();
      var mFanio = miDia.getYear();
      var mFHora = miDia.getHours();
      var mFMinuto = miDia.getMinutes();
      var mFTiempoDia = ( mFHora < 12 ) ? "AM" : "PM";
      
      mFMinuto = ( mFMinuto < 10 ? "0" : "" ) + mFMinuto;
      mFHora = ( mFHora > 12 ) ? mFHora - 12 : mFHora;
      mFHora = ( mFHora == 0 ) ? 12 : mFHora;

      var nombreDia = new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
      var mFHoraExacta = mFHora + ":" + mFMinuto + " " + mFTiempoDia;

      if(mFanio<1000)
        mFanio+=1900
        var mFdia = miDia.getDay();
        var mFmes = miDia.getMonth();
        var mFdiam = miDia.getDate();
      if (mFdiam<10)
        mFdiam="0"+mFdiam
        var nombreMes = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
      
      $('.fecha').html(""+nombreMes[mFmes]+" "+mFdiam+", "+mFanio+"");
      $(".hora").html(""+nombreDia[mFdia]+", "+mFHoraExacta+"");
      
    }

    /*
    * Botón en el footer para regresar al top.
    * @autor: Italo Carlos
    */
    function irArriba (){
      var offset = 300;
      var duration = 500;

      var tipoNavegador = navigator.userAgent.match(/iPhone|iPad|iPod/i);

      if(tipoNavegador){
        $(window).bind("touchend touchcancel touchleave", function(e){
           if ($(this).scrollTop() > offset) {
                $('.scroll-to-top').fadeIn(duration);
            } else {
                $('.scroll-to-top').fadeOut(duration);
            }
        });
      } else {
          $(window).scroll(function() {
                if ($(this).scrollTop() > offset) {
                    $('.scroll-to-top').fadeIn(duration);
                } else {
                    $('.scroll-to-top').fadeOut(duration);
                }
            });
      }
      $('.scroll-to-top').click(function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, duration);
            return false;
        });
    }

    /*
    * Funcion que maneja el menu sidebar
    * @autor: Italo Carlos
    */
    function menuSidebar(){
      $('.page-sidebar').on('click', 'li > a', function (e) {

            var parentLiItem = $(this).parent('li').parent('.page-sidebar-menu');
            var hasSubMenu = $(this).next().hasClass('sub-menu');
            var estosParents = $(this).parents('.page-sidebar-menu-hover-submenu');
            var parent = $(this).parent().parent();
            var the = $(this);
            var menu = $('.page-sidebar-menu');
            var sub = $(this).next();
            var autoScroll = menu.data("auto-scroll");
            var slideSpeed = parseInt(menu.data("slide-speed"));
            var keepExpand = menu.data("keep-expanded");

            if ($('body').hasClass('page-sidebar-closed') &&  parentLiItem.size() === 1) {
                return;
            }
            // exit of hover sidebar menu
            if (getViewPort().width >= resBreakpointMd && estosParents.size() === 1) { 
                return;
            }

            if (hasSubMenu === false) {
                // close the menu on mobile view while laoding a page
                if (getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) {  
                    $('.page-header .responsive-toggler').click();
                }
                return;
            }

            if ($(this).next().hasClass('sub-menu always-open')) {
                return;
            }

            
            if (keepExpand !== true) {
                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
                parent.children('li.open').removeClass('open');
            }

            var slideOffeset = -200;

            if (sub.is(":visible")) {
                $('.arrow', $(this)).removeClass("open");
                $(this).parent().removeClass("open");
                sub.slideUp(slideSpeed, function () {
                    if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                        if ($('body').hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': (the.position()).top
                            });
                        } else {
                            scrollTo(the, slideOffeset);
                        }
                    }
                    altura_Sidebar_Content();
                });
            } else if (hasSubMenu) {
                $('.arrow', $(this)).addClass("open");
                $(this).parent().addClass("open");
                sub.slideDown(slideSpeed, function () {
                    if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                        if ($('body').hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': (the.position()).top
                            });
                        } else {
                            scrollTo(the, slideOffeset);
                        }
                    }
                    altura_Sidebar_Content();
                });
            }

            e.preventDefault();
        });
    }

    /*
    * Funcion que maneja los link del menu sidebar
    * @autor: Italo Carlos
    */
    function handleSidebarMenu(){
      // handle sidebar link click
      $('.page-sidebar').on('click', 'li > a', function (e) {
        if ($('body').hasClass('page-sidebar-closed') &&  $(this).parent('li').parent('.page-sidebar-menu').size() === 1) {
            return;
        }

        var hasSubMenu = $(this).next().hasClass('sub-menu');

        if (getViewPort().width >= resBreakpointMd && $(this).parents('.page-sidebar-menu-hover-submenu').size() === 1) { // exit of hover sidebar menu
            return;
        }

        if (hasSubMenu === false) {
            if (getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) { // close the menu on mobile view while laoding a page 
                $('.page-header .responsive-toggler').click();
            }
            return;
        }

        if ($(this).next().hasClass('sub-menu always-open')) {
            return;
        }

        var parent = $(this).parent().parent();
        var the = $(this);
        var menu = $('.page-sidebar-menu');
        var sub = $(this).next();

        var autoScroll = menu.data("auto-scroll");
        var slideSpeed = parseInt(menu.data("slide-speed"));
        var keepExpand = menu.data("keep-expanded");

        if (keepExpand !== true) {
            parent.children('li.open').children('a').children('.arrow').removeClass('open');
            parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
            parent.children('li.open').removeClass('open');
        }

        var slideOffeset = -200;

        if (sub.is(":visible")) {
            $('.arrow', $(this)).removeClass("open");
            $(this).parent().removeClass("open");
            sub.slideUp(slideSpeed, function () {
                if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                    if ($('body').hasClass('page-sidebar-fixed')) {
                        menu.slimScroll({
                            'scrollTo': (the.position()).top
                        });
                    } else {
                        scrollTo(the, slideOffeset);
                    }
                }
                handleSidebarAndContentHeight();
            });
        } else if (hasSubMenu) {
            $('.arrow', $(this)).addClass("open");
            $(this).parent().addClass("open");
            sub.slideDown(slideSpeed, function () {
                if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                    if ($('body').hasClass('page-sidebar-fixed')) {
                        menu.slimScroll({
                            'scrollTo': (the.position()).top
                        });
                    } else {
                        scrollTo(the, slideOffeset);
                    }
                }
                handleSidebarAndContentHeight();
            });
        }
        e.preventDefault();
      });
      // handle scrolling to top on responsive menu toggler click when header is fixed for mobile view
      $(document).on('click', '.page-header-fixed-mobile .page-header .responsive-toggler', function(){
          scrollTop(); 
      });

      // handle sidebar hover effect        
      handleFixedSidebarHoverEffect();
    }

    // Handles Bootstrap Tabs.

    /*
    * Funcion que maneja las Tabs de Bootstrap.
    * Arregla el alto del contenido al darle click en una tab.
    * @autor: Italo Carlos
    */
    function handleTabs(){
      $('body').on('shown.bs.tab', 'a[data-toggle="tab"]', function () {
            handleSidebarAndContentHeight();
        });
    }

    /*
    * Funcion para tener elementos de 100% de altura
    * ejemplos: (block, portlet, etc)
    * @autor: Italo Carlos
    */
    function handle100HeightContent(){
      var target = $('.full-height-content');
      var height;

      height = getViewPort().height -
            $('.page-header').outerHeight(true) -
            $('.page-footer').outerHeight(true) -
            $('.page-title').outerHeight(true) -
            $('.page-bar').outerHeight(true);

      if (target.hasClass('portlet')) {
          var portletBody = target.find('.portlet-body');
          
          if (getViewPort().width < resBreakpointMd) {
              destroySlimScroll(portletBody.find('.full-height-content-body')); // destroy slimscroll 
              return;
          }

          height = height -
              target.find('.portlet-title').outerHeight(true) -
              parseInt(target.find('.portlet-body').css('padding-top')) -
              parseInt(target.find('.portlet-body').css('padding-bottom')) - 2;

          if (target.hasClass("full-height-content-scrollable")) {
              height = height - 35;
              portletBody.find('.full-height-content-body').css('height', height);
              initSlimScroll(portletBody.find('.full-height-content-body'));
          } else {
              portletBody.css('min-height', height);
          }
      } else {
          if (getViewPort().width < resBreakpointMd) {
              destroySlimScroll(target.find('.full-height-content-body')); // destroy slimscroll 
              return;
          }

          if (target.hasClass("full-height-content-scrollable")) {
              height = height - 35;
              target.find('.full-height-content-body').css('height', height);
              initSlimScroll(target.find('.full-height-content-body'));
          } else {
              target.css('min-height', height);
          }
      }
    }

   

    /*
    * Funcion para manejar el modo de Material Design
    * @autor: Italo Carlos
    */
    function handleMaterialDesign(){

      $.handleInput = handleInput;

      // Material design ckeckbox and radio effects
      $('body').on('click', '.md-checkbox > label, .md-radio > label', function() {
          var the = $(this);
          var el = $(this).children('span:first-child'); // Busca el primer span que es circulo/burbuja
          el.addClass('inc'); // agrega la clase de la burbuja
          var newone = el.clone(true);  // clona el elemento
          el.before(newone);  // agrega la version clonada antes del elemento original
          $("." + el.attr("class") + ":last", the).remove(); //elimina el original y asi esta listo para el siguiente click
      }); 

      if ($('body').hasClass('page-md')) { 
          // Material design click effect
          // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design       
          $('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function(e) { 
              var element, circle, d, x, y;

              element = $(this);
    
              if(element.find(".md-click-circle").length == 0) {
                  element.prepend("<span class='md-click-circle'></span>");
              }
                  
              circle = element.find(".md-click-circle");
              circle.removeClass("md-click-animate");
              
              if(!circle.height() && !circle.width()) {
                  d = Math.max(element.outerWidth(), element.outerHeight());
                  circle.css({height: d, width: d});
              }
              
              x = e.pageX - element.offset().left - circle.width()/2;
              y = e.pageY - element.offset().top - circle.height()/2;
              
              circle.css({top: y+'px', left: x+'px'}).addClass("md-click-animate");

              setTimeout(function() {
                  circle.removeClass('md-click-animate');
              }, 1000);
          });
      }

      // Labels Flotantes
      function handleInput(el){
        if (el.val() != "") {
              el.addClass('edited');
          } else {
              el.removeClass('edited');
          }
      }

      $('body').on('keydown', '.form-md-floating-label .form-control', function(e) { 
            handleInput($(this));
        });
        $('body').on('blur', '.form-md-floating-label .form-control', function(e) { 
            handleInput($(this));
        });

    }

    /*
    * Funcion para las herramientas de Paneles de contenido 
    *(portlet tools)
    * @autor: Italo Carlos
    */
    function handlePortletTools(){
      // Eliminar panel
      $('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function(e) {
          e.preventDefault();
          var portlet = $(this).closest(".portlet");

          if ($('body').hasClass('page-portlet-fullscreen')) {
              $('body').removeClass('page-portlet-fullscreen');
          }

          portlet.find('.portlet-title .fullscreen').tooltip('destroy');
          portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
          portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
          portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
          portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

          portlet.remove();
      });

      // Panel a pantalla completa
      $('body').on('click', '.portlet > .portlet-title .fullscreen', function(e) {
          e.preventDefault();
          var portlet = $(this).closest(".portlet");
          if (portlet.hasClass('portlet-fullscreen')) {
              $(this).removeClass('on');
              portlet.removeClass('portlet-fullscreen');
              $('body').removeClass('page-portlet-fullscreen');
              portlet.children('.portlet-body').css('height', 'auto');
          } else {
              var height = Metronic.getViewPort().height -
                  portlet.children('.portlet-title').outerHeight() -
                  parseInt(portlet.children('.portlet-body').css('padding-top')) -
                  parseInt(portlet.children('.portlet-body').css('padding-bottom'));

              $(this).addClass('on');
              portlet.addClass('portlet-fullscreen');
              $('body').addClass('page-portlet-fullscreen');
              portlet.children('.portlet-body').css('height', height);
          }
      });

      // Colapsar y contraer el Panel
      $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function(e) {
          e.preventDefault();
          var el = $(this).closest(".portlet").children(".portlet-body");
          if ($(this).hasClass("collapse")) {
              $(this).removeClass("collapse").addClass("expand");
              el.slideUp(200);
          } else {
              $(this).removeClass("expand").addClass("collapse");
              el.slideDown(200);
          }
      });

    }

    /* Carga de algunas funciones Funciones */
    handleMaterialDesign();
    handlePortletTools();
    menuSidebar();
    handleFixedSidebarHoverEffect();
    handleSidebarToggler();
    getViewPort();
    detectorIE();
    cargarClima();
    setInterval(function() {
      mostrarFechaYHora();
    }, 1000);
    irArriba();
    handle100HeightContent();
    initSlimScroll('.scroller');
    $('.tooltips').tooltip();

})(jQuery);
	

  //Metronic.init(); // init metronic core componets
  //Layout.init(); // init layout
  //QuickSidebar.init(); // init quick sidebar
  //Demo.init(); // init demo features