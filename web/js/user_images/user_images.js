//内置动画选择窗口
define(['tmpl','util','win_manager'],function(tmpl,Util,WinManager){
    var TMPL_NAME = 'user_images';
    var ITEM_TMPL_NAME = 'user_images_item';
    var IMG_TMPL_NAME = 'imgs_list';

    // 当前选中项
    var currentSelectedItem;


    var UserImages = {
        //初始化
        init:function(opt){
            opt = opt || {};

            this.name = 'userImages';
            this.id = Util.getRandomId();

            this.headerName = '图片管理';

            

        },
        //事件绑定
        bind:function(){
            var self = this;
            // 图片加载重置尺寸
            this.userImageList[0].addEventListener('load',function(e){

                var target = $(e.target);
                var parent = target.parent();
                var naturalWidth = target.prop('naturalWidth');
                var naturalHeight = target.prop('naturalHeight');
                var w,h,marginLeft,marginTop;

                if(naturalWidth > naturalHeight){
                    h = parent.height();
                    w = h / naturalHeight * naturalWidth;
                    marginLeft = (parent.width() - w) / 2;
                    marginTop = 0;
                }
                else{
                    w = parent.width();
                    h = w / naturalWidth * naturalHeight;
                    marginTop = (parent.height() - h) / 2;
                    marginLeft = 0;                    
                }

                target.css({
                    width:w,
                    height:h,
                    marginTop:marginTop,
                    marginLeft:marginLeft
                });

            },true);

            this.allUserImgesWorkList.on('click',function(e){
                var item = $(e.target);
                var container = item.closest('.list-group');
                var name = container.data('name');
         
                // 点击中一个作品/元件
                if(item.hasClass('user_images_item')){
                    // 选中
                    self.select(item,name);
                }

            });

            // 点击删除按钮
            this.userImageList.on('click','.img-del-btn',function(e){
                if(!window.confirm('确认删除此图片？')) return;
                var delItem = $(e.target).closest('.img-container');
                var id = currentSelectedItem.data('id');
                var pathArr = $(delItem.find('img')).prop('src').split('/'); 
                var fileName = pathArr[pathArr.length - 1];


                var container = currentSelectedItem.closest('.list-group');
                var name = container.data('name');
                var type = name == 'ctrl' ? 1 : 0;

                if(id == 'tempwork' || id == 'tempctrl'){
                    type = id == 'tempctrl' ? 1 : 0;
                    id = null;
                }


                Util.delImg(fileName,id,type,function(data){

                    self.userAvailableSize.text('剩余可用空间：' + data.available_folder_size + 'MB');

                    delItem.remove();

                    if(!self.getImgsInContainer().length){
                        self.userImageList.html('<div class="user-no-img-tips">暂无图片</div>');
                    }
                    alert('删除成功');
                });
            });

        },
        getImgsInContainer:function(){
            return $(this.userImageList.find('.user_images_item'));
        },
        render:function(){
    
            var id = TMPL_NAME + '_' + this.id;
            //菜单模板字符串
            var tmplString = tmpl[TMPL_NAME]({
                id:id
            }); 

            //添加新页的html串
            WinManager.add(this.name,tmplString);
            
            //菜单元素
            this.element = $('#' + id); 
            //用户作品列表
            this.userImagesWorkList = $('.user-images-work-list');
            //图片列表
            this.userImageList = $('.user-images-content');
            //全部作品/元件列表
            this.allUserImgesWorkList = $('.user-images-all-list');
            // 元件列表
            this.userImageCtrlList = $('.user-images-controller-list');

            //当前目录作品列表
            this.userImagesWorkTempList = $('.user-images-work-temp-list');
            //当前目录元件列表
            this.userImagesCtrlTempList = $('.user-images-ctrl-temp-list');
            //当前目录列表
            this.currentTempHeading = $('.current-temp-heading');
            //可用存储空间的值
            this.userAvailableSize = $('.user-images-available-size');


            //事件绑定
            this.bind();                
            
        },

        renderData:function(data,container,name){
            var workDataStr = '';


            this.localData = data;

            $.each(data[name], function(id,obj){
                workDataStr += tmpl[ITEM_TMPL_NAME]({
                    name:obj.name,
                    id:id
                }); 
            });
            container.html(workDataStr);
            
        },
        //选择一个作品，展示图片列表
        select:function(item,name){
     
            var id = item.data('id');
            var obj = this.localData[name][id];

            if(currentSelectedItem){
                currentSelectedItem.removeClass('active');
            }
            currentSelectedItem = item;
            item.addClass('active');

            if(!obj) return;

            if(obj.imgList.length){
                var imgListDatStr = tmpl[IMG_TMPL_NAME]({
                    imgList:obj.imgList
                });   
                this.userImageList.html(imgListDatStr);         
            }
            else{
                this.userImageList.html('<div class="user-no-img-tips">暂无图片</div>');
            }

            
        },
        getItemByWorkId:function(workId){
            var list = $(this.userImagesWorkList.find('.user_images_item'));
            var item;
            list.each(function(i,it){
                it = $(it);
                if(it.data('id') == workId){
                    item = it;
                    return false;
                }
            });
            return item;

        },

        //展示
        show:function(data,userAvailableSizeValue,currentWorkId){
            var self = this;

            if(!this.element){
                this.render();
            }

            //作品列表
            this.renderData(data,this.userImagesWorkList,'work');
            // 元件列表
            this.renderData(data,this.userImageCtrlList,'ctrl');
            //当前作品目录
            this.renderData(data,this.userImagesWorkTempList,'tempwork');
            //当前元件目录
            this.renderData(data,this.userImagesCtrlTempList,'tempctrl');
            //当前目录id
            this.currentWorkId = currentWorkId;
            //更新用户可用存储空间的值
            this.userAvailableSize.text('剩余可用空间：' + userAvailableSizeValue + 'MB');
            //目前打开的是已保存的作品
            if(currentWorkId){
                var currentItem = this.getItemByWorkId(currentWorkId);
                this.select(currentItem,'work');
                this.userImagesWorkTempList.hide();  
                this.userImagesCtrlTempList.hide();  
                this.currentTempHeading.hide();
            }
            else{
              // 默认展示当前临时作品目录
                var firstItem = $(this.allUserImgesWorkList.find('.user_images_item')[0]);
                this.select(firstItem,'tempwork');  

                this.userImagesWorkTempList.show();  
                this.userImagesCtrlTempList.show();  
                this.currentTempHeading.show();        
            }


            WinManager.show({
                name:this.name,
                headerName:this.headerName,
                onConfirm:function(){
                    
                                    
                }
            });

            
        }
    };

    return UserImages;
});