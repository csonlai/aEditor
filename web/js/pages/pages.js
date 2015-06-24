define(['tmpl','util'],function(tmpl,Util){

	var TMPL_NAME = 'pages';
	//页对象数组
	var pageObjs = [];
	//当前页码
	var currentPage;
	var currentPageIndex = 0;

	//页对象
	function Page(opt){
		this.init(opt);
	};

	Page.prototype = {

		init:function(opt){
			opt = opt || {};
			
			//页列表元素
			this.pagesList = $('.pages-list');

			this.setData(opt);
			//渲染
			this.render();
			//页元素
			this.element = this.getPageElement();
			//页索引元素
			this.pageIndexElement = $('.page-index',this.element);
			//自动跳转选择
			this.autoJumpCheckBox = $('.auto-jump-checkbox',this.element);
			//手动跳转选择
			//this.slideJumpCheckBox = $('.slide-jump-checkbox',this.element);

			//是否允许返回上一页
			this.preJumpCheckBox = $('.prejump-checkbox',this.element);
			//是否重复播放页动画
			this.replayCheckBox = $('.replay-checkbox',this.element);

			//设置索引
			this.setIndex(this.index);

			//设置checkbox索引
			this.setCheckBoxJumpType({
				autoJump:opt.autoJump,
				preJump:opt.preJump || true, // 默认可以返回上一页
				replay:opt.replay
			});

			//事件绑定
			this.bind();

		},
		getData:function(){

			var jumpType = this.getCheckBoxJumpType();

			return {
				id:this.id,
				index:this.index,
				preJump:jumpType.preJump,
				autoJump:jumpType.autoJump,
				replay:jumpType.replay
			};
		},
		setData:function(opt){
			//随机id
			this.id = opt.id || Util.getRandomId();	
			//页索引
			this.index = opt.index || 0;

		},
		bind:function(){
			var self = this;
			var element = this.element;
			//删除页按钮
			var delPageBtn = $('.page-del-btn',element);


			//hover了一页,显示删除按钮
			element.on('mouseover',function(e){
				self.showDeleteBtn();
			});
			//blur了一页，隐藏删除按钮
			element.on('mouseout',function(e){
				self.hideDeleteBtn();
			});
			//监听删除按钮鼠标按下事件，避免冒泡到页面选择
			delPageBtn.on('mousedown',function(e){
				e.stopPropagation();
			});
			//删除按钮点击删除页
			delPageBtn.on('click',function(e){
				e.stopPropagation();

				if(window.confirm('是否删除该页面?')){
					//根据id从页面列表删除页面对象
					Page.deletePageById(self.id);
				}

			});


			//可拖动
			this.element.draggable({
				axis: "y",
				start:function(e,ui){
					// var targetPage = $(e.target);
					// var targetPageObj = Page.getPageById(Util.getOriginId(targetPage.attr('id')));					
					// targetPageObj.select();
				},
				stop:function(e,ui){
					var targetPage = $(e.target);
					var targetPageObj = Page.getPageById(Util.getOriginId(targetPage.attr('id')));
					var targetPageTop = targetPage.offset().top;
					var insertIndex;

					//要插入在哪页之前
					var pageToInsertBefore;

					//拖拽页的中线
					var targetPageCenter = targetPageTop + targetPage.height() / 2;
					//检查所有页对象的元素与拖动页的位置关系
					for(var i = 0 , l = pageObjs.length; i < l; i++){
						var pageElem = pageObjs[i].element;
						var pageTop = pageElem.offset().top;
						var PageHeight = pageElem.height();
						//页的中线
						var pageCenter = pageTop + PageHeight / 2;

						//更新插入位置之后的页对象索引
						if(pageObjs[i] != targetPageObj){
								
							if(targetPageCenter < pageCenter){
								pageToInsertBefore = pageElem.parent();	
								insertIndex = i;
								break;	
							}		
						}
					};


					targetPage.parent().insertBefore(pageToInsertBefore);

					if(!pageToInsertBefore){
						Page.pagesList.append(targetPage.parent());
					}

					//去除用于拖拽的属性
					targetPage.css({
						top:'auto'
					});
					
					//更新排序与索引
					Page._updatePageIndex(targetPageObj);
					//拖拽页选中
					targetPageObj.select();

				}
			});	


		},
		setCheckBoxJumpType : function(opt){
			this.autoJumpCheckBox.get(0).checked = opt.autoJump;
			this.preJumpCheckBox.get(0).checked = opt.preJump;
			this.replayCheckBox.get(0).checked = opt.replay;
		},
		getCheckBoxJumpType : function(){
			return {
				autoJump : this.autoJumpCheckBox.get(0).checked,
				preJump : this.preJumpCheckBox.get(0).checked,
				replay:this.replayCheckBox.get(0).checked
			};
		},
		//设置页索引
		setIndex:function(index){
			var element = this.getPageElement();
			element.attr('data-index',index);
			this.index = index;
			this.pageIndexElement.html('' + index); 
		},
		//展示删除按钮
		showDeleteBtn:function(){
			var element = this.getPageElement();
			element.addClass('show-del-btn');
		},
		//隐藏删除按钮
		hideDeleteBtn:function(){
			var element = this.getPageElement();
			element.removeClass('show-del-btn');
		},
		getPageElement:function(){
			return $('#' + TMPL_NAME + '_' + this.id);
		},
		render:function(){
			//新页的html串
			var newPageTmplStr = tmpl[TMPL_NAME]({
				id:TMPL_NAME + '_' + this.id,
				index:this.index
			});	
	
			//添加新页的html串
			this.pagesList.append(newPageTmplStr);		
		},
		//选择该页
		select:function(){
		
			//页元素
			var element = this.getPageElement();
			if(element.hasClass('selected')) return;

			console.log('Page select');

			setTimeout(function(){
				element.addClass('selected');
			},0);
			
			//触发page选择页事件
			$(window).trigger('pageSelect',{
				selectedPage:this
			});	

			console.log(this.index);
		},
		//取消选中该页
		unSelect:function(){

			//页元素
			var element = this.getPageElement();
			element.removeClass('selected');
			//触发page取消选择页事件
			$(window).trigger('pageUnselect',{
				unSelectedPage:this
			});
		},
		//删除
		remove:function(){
			var element = this.getPageElement();
			element.remove();
		}
	};

	//多页面展示区域
	Page.init = function(opt){
		opt = opt || {};
		//新增一页按钮元素
		this.pagesAddBtn = $('.pages-add-button');
		//页列表元素
		this.pagesList = $('.pages-list');

		this.setData(opt);

		//事件绑定
		this.bind();
		

	};
	//获取数据
	Page.getData = function(){
		var pagesDataArr = [];
		$(pageObjs).each(function(i,pageObj){
			var pageData = pageObj.getData();
			pagesDataArr.push(pageData);
		});
		return {
			pagesDataArr:pagesDataArr
		};
	};
	//设置数据
	Page.setData = function(opt){
		opt = opt || {};
		pageObjs = [];
		currentPage = null;
		this.clearDomList();

		if(opt.pagesDataArr){
			$(opt.pagesDataArr).each(function(i,pageData){
				var page = new Page(pageData);
				pageObjs.push(page);
			});
		}
	};
	Page.bind = function(){
		var self = this;
		//新增一页按钮点击
		this.pagesAddBtn.on('click',function(){
			self.add();
		});
		//选择了一页
		this.pagesList.on('mousedown','.page',function(e){

			var selectPage = $(this);
			var selectPageIndex = selectPage.attr('data-index');
			
			if(selectPage.length){
				self.select(selectPageIndex);
			}
		});



		//更新当前页对象的引用
		$(window).on('pageSelect',function(){
			var e = arguments[1];
			var page = e.selectedPage;
			//取消上一个页面的选择态
			if(currentPage && currentPage != page){
				currentPage.unSelect();
			}
			currentPage = page;

		});
		
	};
	//获取当前页对象
	Page.getCurrentPage = function(){
		return currentPage;
	};
	//根据index获取页对象
	Page.getPageByIndex = function(index){
		for(var i = 0,l = pageObjs.length;i<l;i++){
			if(pageObjs[i].index == index){
				return pageObjs[i];
			}
		}
	};
	//根据id获取页对象
	Page.getPageById = function(id){
		for(var i = 0,l = pageObjs.length;i<l;i++){
			if(pageObjs[i].id == id){
				return pageObjs[i];
			}
		}
	};
	//根据id从列表删除页面对象以及元素
	Page.deletePageById = function(delPageId){
		var isDeleteCurrentPage;
		
		for(var i = 0 ; i < pageObjs.length ; i++){
			//设置索引
			pageObjs[i].setIndex(i);

			if(pageObjs[i].id == delPageId){

				//删除的是选中页
				if(delPageId == currentPage.id){
					//删除了选中的最后一页
					if(currentPageIndex == pageObjs.length - 1){
						currentPageIndex--;
					}
				
				}
				//删除页在选中页下方
				else if(i > currentPageIndex){

				}
				//删除页在选中页上方
				else if(i < currentPageIndex){
					currentPageIndex--;
				}

				pageObjs[i].remove();
				pageObjs.splice(i,1);

				i--;
			}
		}


		//触发页面被删除事件
		$(window).trigger('pageDelete',{
			pageId:delPageId
		});


		//如果删除的是当前页，则选中下一页或上一页
		var nextPage = this.getPageByIndex(currentPageIndex);
		if(nextPage){
			nextPage.select();
		}
		

	};

	//更新页索引
	Page._updatePageIndex = function(targetPageObj ){
		var self = this;
		var pages = $('.page');
	
		$.each(pages,function(index,dom){
			var pageObj = Page.getPageById(Util.getOriginId(dom.id));
			pageObj.setIndex(index);
		});


		pageObjs = pageObjs.sort(function(p1,p2){
			return p1.index > p2.index;
		});
		//页面排序改变事件通知
		$(window).trigger('pagesOrderChange',{
			pages:pageObjs,
			currentPageIndex:pageObjs.indexOf(targetPageObj)
		});
	};
	//获取所有页对象
	Page.getPages = function(){
		return pageObjs;
	};
	//清除dom列表
	Page.clearDomList = function(){
		this.pagesList.html('');
	};
	Page.add = function(){
		//新增一页
		var newPage = new Page({
			index:pageObjs.length
		});
		
		//新增到数组
		pageObjs.push(newPage);

		//触发page增加事件
		$(window).trigger('pageAdd',{
			page:newPage
		});

		//新的页被选中
		newPage.select();
	};

	//选择某一页
	Page.select = function(index){
		var selectPage = this.getPageByIndex(index);
		selectPage.select();
		currentPageIndex = index;
	};

	//选择下一页
	Page.next = function(){
		if(currentPage.index + 1 >= pageObjs.length){
			return;
		}
		Page.select(currentPage.index + 1);
	};
	//删除页
	Page.remove = function(){
		$.each(pageObjs,function(n,page){
			page.remove();
		});
	};


	return Page;
});