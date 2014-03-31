Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

        launch: function() {

            var that = this;
            
            var cb = Ext.create('Ext.Container', {
            
            items: [
                {
                    xtype  : 'rallybutton',
                    text      : 'create',
                    id: 'b2',
                    handler: function() {
                            that._getModel(); 
                    }
                }
                        
                ]
            });
            this.add(cb);

        },
        
        _getModel: function(){
            var that = this;
            Rally.data.ModelFactory.getModel({
                type: 'Defect',
                context: {
                    workspace: '/workspace/2509171170'
                },
                success: function(model) {  //success on model retrieved
                    that._model = model;
                    var defect = Ext.create(model, {
                        Name: 'bad defect',
                        State: 'Open',
                        Description: 'bad defect'
                    });
                    defect.save({
                        callback: function(result, operation) {
                            if(operation.wasSuccessful()) {
                                console.log("_ref",result.get('_ref'), ' ', result.get('Name'));
                                that._record = result;
                                that._readAndUpdate();
                            }
                            else{
                                console.log("?");
                            }
                        }
                    });
                }
            });
        },
        
        _readAndUpdate:function(){
            var id = this._record.get('ObjectID');
            console.log('OID', id);
            var weblink={'LinkID': 'NM-123', 'DisplayString': ''};
            this._model.load(id,{
                fetch: ['Name', 'FormattedID', 'JiraWebLink'],
                callback: function(record, operation){
                    record.set('JiraWebLink',weblink);
                    record.save({
                        callback: function(record, operation) {
                            if(operation.wasSuccessful()) {
                                console.log('JiraWebLink after update:', record.get('JiraWebLink'));
                            }
                            else{
                                console.log("?");
                            }
                        }
                    });
                }
            })
        }
});
