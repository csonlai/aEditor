define(['tmpl','util','win_manager'],function(tmpl,Util,WinManager){

	var TMPL_NAME = 'work_list';
	var TMPL_ITEM_NAME = 'work_list_item';

	var currentTarget;

	var currentWorkData;


	var pageDataObj = {};

	var currentPageIndex = 0;
	var PAGE_SIZE = 8;
	var allWorkList = [];
	var totalPageNum;
	var isLoading;



	//元件选择列表
	var WorkList = {
		init:function(opt){
			opt = opt || {};
			this.headerName = '打开作品';
			this.name = 'WorkList';

		},
		save:function(){

		},
		//获取作品列表数据
		getData:function(page,size,callback){
			// var listDataStr = localStorage.getItem('controllerRenderDataList');
			// var listData = JSON.parse(listDataStr);

			// console.log(listData);

			//作品列表
			var workList = [];
			var self = this;

			Util.getWorks(page,size,function(data){
				var works = data.works;
			
				//总页数
				if(totalPageNum == null){
					totalPageNum = data.total_page;
					//检查翻页按钮的显示/隐藏状态
					self.checkPageBtnVisibility();	
				}

				$.each(works,function(name,workData){

					//添加到作品列表
					workList.push({
						id:workData._id,
						name:workData.name,
						workData:JSON.parse(workData.work_data)
					});

					workList[workList.length - 1].workData.id = workData._id;
				});

				//保存到全部数据的数组
				allWorkList = allWorkList.concat(workList);

				callback && callback(workList,data.cur_page == data.total_page);

			});
			
		},
		renderPage:function(page,size,pageData){
			
			if(pageData.length == 0 && page == 0){
				this.list.html('<div class="no-work-tips">暂无作品</div>');
			}
			else{
				var workListTmplStr = tmpl[TMPL_ITEM_NAME]({
					workList:pageData
				});	
				//渲染列表 
				this.list.html(workListTmplStr);			
			}


		},
		getPageData:function(page,size){

			var self = this;
			isLoading = true;
		
			this.getData(page,size,function(pageData,isEnd){

				isLoading = false;

				self.renderPage(page,size,pageData);

				//保存第n页的数据
				pageDataObj[page] = pageData;

			});


		},
		bind:function(){
			var self = this;

			//点击列表
			$('.work-list').on('click',function(e){
		
				var target = $(e.target);

				if(currentTarget){
					currentTarget.removeClass('active');
				}

				//为所选列表元素增加active类
				target.addClass('active');

				currentTarget = target;
				
				$(allWorkList).each(function(i,data){

					if(data.id == target.prop('id')){
						currentWorkData = data.workData;
					}

				});
			});

			//点击列表
			$('.work-list').on('click','.work-delete-btn',function(e){
				if(!window.confirm('是否删除该作品？')){
					return;
				}
			
				var item = $(this).closest('.list-group-item');
				var workId = item.prop('id');
				var list = item.parent();
				
				self.delete(workId ,function(data){
					item.remove();
					//该页剩余作品dom元素
					var leftWorksElements = $('.list-group-item',list);

					totalPageNum--;
				
					//该页元素都被删除了，则自动加载下一页
					if(!leftWorksElements.length){
						if(!self.nextBtn.hasClass('disabled')){
							currentPageIndex--;
							self.next();
						}
						else{
							self.list.html('<div class="no-work-tips">暂无作品</div>');
						}
						
						
					}
				});

			});

			$('.work-list').on('mouseover','.list-group-item',function(){
				$(this).addClass('over');
			});
			$('.work-list').on('mouseout','.list-group-item',function(){
				$(this).removeClass('over');
			});

			//上一页数据
			this.preBtn.on('click',function(){
				if($(this).hasClass('disabled')) return;
				self.pre();
			});

			//下一页数据
			this.nextBtn.on('click',function(){
				if($(this).hasClass('disabled')) return;
				self.next();
			});
		},

		render:function(){
			if(!this.element || !this.element.length){
				var id = TMPL_NAME + '_' + this.id;
				//菜单模板字符串

				var tmplString = tmpl[TMPL_NAME]({
					id:id
				});	

				WinManager.add(this.name,tmplString);

				//元素
				this.element = $('#' + id);	
				//列表容器
				this.list = $('.work-list');
				//上一页按钮
				this.preBtn = $('.pre-work-list');
				//下一页按钮
				this.nextBtn = $('.next-work-list');
				//事件绑定
				this.bind();			
			}			
		},
		show:function(){
			
			var self = this;

			if(!this.element || !this.element.length){
				this.render();
			}

			WinManager.show({
				name:this.name,
				headerName:this.headerName,
				onConfirm:function(){

					//选择了一个作品
					$(window).trigger('workSelect',{
						workData:currentWorkData
					});
				
				},
				onCancel:function(){
			
					currentTarget = currentWorkData = totalPageNum = null;
					pageDataObj = {};
					currentPageIndex = 0;
					allWorkList = [];

				}
			});

			this.getPageData(currentPageIndex,PAGE_SIZE);

			

		},
		//检查翻页按钮的显示/隐藏状态
		checkPageBtnVisibility:function(){
			if(totalPageNum <= currentPageIndex){
				this.nextBtn.addClass('disabled');
			}
			else{
				this.nextBtn.removeClass('disabled');
			}

			if(0 >= currentPageIndex){
				this.preBtn.addClass('disabled');
			}
			else{
				this.preBtn.removeClass('disabled');
			}
		},
		//下一页
		next:function(){
			currentPageIndex++;
			this.checkPageBtnVisibility();
			this.getPageData(currentPageIndex,PAGE_SIZE);
		},
		//上一页
		pre:function(){
			currentPageIndex --;
			this.checkPageBtnVisibility();
			if(pageDataObj[currentPageIndex]){
				this.renderPage(currentPageIndex,PAGE_SIZE,pageDataObj[currentPageIndex]);
			}
			else{
				this.getPageData(currentPageIndex,PAGE_SIZE);
			}

		},
		create:function(data,success){
			//创建作品
			Util.createWork(data,function(data){
				success && success(data);
				alert('保存成功！');
			});			
		},
		update:function(data,success){
			//更新作品
			Util.updateWork(data,function(data){
				success && success(data);

				alert('更新成功！');
			});				
		},
		delete:function(id,success){
			//删除作品
			Util.deleteWork(id,function(data){
				alert('删除成功！');

				success && success(data);
			});			
		}
	};


	return WorkList;

});