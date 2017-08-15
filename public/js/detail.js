$(function(){
	$(".comment").click(function(){
		var target = $(this)
		var toId = target.data("tid")
		var commentId = target.data("cid")

		if($("#toId").length){
			$("#toId").val(toId)
		}else{
			$("<input>").attr({
				type:"hidden",
				name:"comment[tid]",
				value:toId,
				id:"toId"
			}).appendTo("#commentForm")	
		}

		if($("#commentId").length){
			$("#commentId").val(commentId)
		}else{
			$("<input>").attr({
				type:"hidden",
				name:"comment[cid]",
				value:commentId,
				id:"commentId"
			}).appendTo("#commentForm")	
		}
	})
})