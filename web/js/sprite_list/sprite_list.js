define(['tmpl','util'],function(tmpl,Util,WinManager){
    var TMPL_NAME = 'sprite_list_item';
    //上一次选中的item
    var preSelectItem;



    //精灵列表
    var SpriteList = {
        init:function(opt){
            opt = opt || {};
            this.name = 'spriteList';
            this.element = $('.sprite-select-container-wrap');
            this.bind();
        },
        bind:function(){
            var self = this;

            //监听精灵增加事件，增加一个精灵项
            $(window).on('spriteAdd',function(){
                var e = arguments[1];
                var sprite = e.sprite;
                var newItem = self.addSpriteItem(sprite);
                //新加的元素立刻选中
                self.select(newItem);
            });

            //监听精灵选择事件，选择一个精灵项
            $(window).on('spriteSelect',function(){
                var e = arguments[1];
                var id = e.selectedSprite.id;
                var item = $('#sprite_item_' + id);
                self.select(item);
            });

            //监听精灵删除事件，删除一个精灵项
            $(window).on('spriteDelete',function(){
                var e = arguments[1];
                var id = e.sprite.id;
                self.removeSpriteItem(id);
            });

            //检查只显示该页的精灵
            $(window).on('pageSelect',function(){
                var e = arguments[1];
                var stageId = e.selectedPage.id;
                self.checkSpriteListItemVisibility(stageId);
            });


            //精灵名改变
            $(window).on('spriteSettingChanged',function(){
                var e = arguments[1];
                var spriteSetting = e.spriteSetting;
                if(preSelectItem){
                    var name = preSelectItem.find('.sprite-name');
                    if(name.text() !== spriteSetting.name){
                        name.text(spriteSetting.name);
                    }
                }
            });


            //点击选中精灵
            this.element.on('click','.sprite_item',function(e){
             
                var id = Util.getOriginId($(this).prop('id'));
                self.select($(this));

                //触发选中一个精灵项的事件
                $(window).trigger('spriteItemClick',{
                    id:id
                });
            });
            //点击删除精灵
            this.element.on('click','.sprite-list-delete-btn',function(e){
                var item = $(this).closest('.sprite_item');
                var id = Util.getOriginId(item.prop('id'));
                

                //触发选中一个精灵项的事件
                $(window).trigger('spriteItemDelete',{
                    id:id
                });
            });

            //点击锁定精灵
            this.element.on('change','.glyphicon-lock',function(e){
                var isChecked = $(this).prop('checked');
                var item = $(this).closest('.sprite_item');
                var elementId = item.prop('id');
                var id = Util.getOriginId(elementId);
            
                //锁状态的变更事件通知
                $(window).trigger('lockStateChanged',{
                    lock:isChecked,
                    id:id,
                    //是否改变当前选中精灵的锁定状态
                    isCurrentSprite:elementId == preSelectItem.prop('id')
                });
            });


            //点击隐藏精灵
            this.element.on('change','.glyphicon-eye-open',function(e){
                var isChecked = $(this).prop('checked');
                var item = $(this).closest('.sprite_item');
                var elementId = item.prop('id');
                var id = Util.getOriginId(elementId);

                debugger;

                //隐藏状态的变更事件通知
                $(window).trigger('hideStateChanged',{
                    isHide:isChecked,
                    id:id
                });

            });


       
            this.element.on('click','.glyphicon-lock',function(e){
                e.stopPropagation();
            });
       
            this.element.on('click','.glyphicon-eye-open',function(e){
                e.stopPropagation();
            });


        },
        //检查只显示该舞台的精灵
        checkSpriteListItemVisibility:function(stageId){
            var spriteItems = $('.sprite_item',this.element);
            $(spriteItems).each(function(i,spriteItem){
                spriteItem = $(spriteItem);
                
                if(spriteItem.data('stageid') != stageId){
                    spriteItem.hide();
                }
                else{
                    spriteItem.show();
                }
            });
        },
        select:function(item){

            item = $(item);

            if(item.hasClass('active')){
                return;
            }

            if(preSelectItem){
                preSelectItem.removeClass('active');
            }
            item.addClass('active');
            preSelectItem = item;
        },
        removeSpriteItem:function(id){
            $('#sprite_item_' + id).remove();
        },
        addSpriteItem:function(sprite){

            var tmplString = tmpl[TMPL_NAME]({
                id:'sprite_item_' + sprite.id,
                stageId:sprite.stage.id,
                name:sprite.name
            }); 

            this.element.append(tmplString);

            var children = this.element.children();

            return children[children.length - 1];
        }
    };

    return SpriteList;

});