Backbone.Marionette.TabControl = Marionette.LayoutView.extend({
  template    : function() { return $('<ul class="nav nav-tabs"></ul><div class="tab-content"></div>'); },
  tagName     : 'div',
  className   : 'tabbed-content',

  liView      : '<li><a href="#<%= tabid %>" role="tab" data-toggle="tab" data-i18n="<%= tabtitle %>"></a></li>',
  tabView     : '<div role="tabpanel" class="tab-pane" id="<%= tabid %>"></div>',
  tabs        : [],
  data        : {},
  defaultTab  : 0,
  regions     : {
    tabRegion : '.tab-content'
  },

  events : {
    'click .nav-tabs a' : 'showTab'
  },


  initialize : function() {
    var self = this;

    self.addRegion('tabRegion', '.tab-content');

    self.tabRegion.on('show', function( view ){
      window.onViewRendered( view )
    });
    self.tabRegion.on('empty', function( view ){
      window.onViewChanged( view );
    });
  },

  setObject : function(data)
  {
    var self = this;
    $.each(data, function(index,value){
      self.set(index, value);
    });
  },

  set : function(key, val)
  {
    this.data[key] = val;
  },

  get : function(key)
  {
    if ( _.isUndefined(key) )
      return this.data;

    return this.data[key];
  },

  onShow : function(){
    var self = this;
    _.each(this.tabs, function(tab, index){
      $tablist = self.$el.find('.nav');
      $tabcontent = self.$el.find('.tab-content');

      // Renderiza o html responsavel pelas tabs
      $tablist.append(_.template(self.liView)({tabid : tab.id, tabtitle : tab.title}));
    });

    self.$el.find('.nav-tabs a').eq(self.defaultTab).click();
  },

  getTabId : function(id){
    return _.filter(this.tabs, function(item){ return item.id == id })[0];
  },

  setParent : function(object)
  {
    var self = this;
    if(_.isUndefined(object.parent))
      object.parent = self;

    console.warn(object)
    console.warn(object.parent)
  },

  showTab : function(e){
    var self = this;
    var el = $(e.currentTarget)
    var id = el.attr('href').replace('#', '');
    var tabObject = self.getTabId(id);
    var view = (typeof tabObject.view === 'object') ? tabObject.view : new tabObject.view(this.data);

    self.setParent(view);
    self.tabRegion.show(view);
  }
});