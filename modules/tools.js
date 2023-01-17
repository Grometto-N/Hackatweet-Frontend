function checkBody(body, keys){
    let answer = true;
    for(let item of keys){
        if(body[item] === "" || !body[item]){
            answer = false;
        }
      }
      return answer;
}


function getHashtags(message) {
    const rgx = /#(\w+)\b/g;
    const result = [];
    let temp;
    while(temp = rgx.exec(message)){
        result.push(`#${temp[1]}`)
    }
    return result;
}


function setSpan(message){
    const messageArray = message.split(' ');
    const arraySpanHashtag = messageArray.map(elt => {
           if(elt[0]==='#'){
                return <span>${elt}</span>;
           }else{
                return elt;
           }
        })
    return arraySpanHashtag;
}

function formattedDate(date){
    
}


module.exports = { checkBody, getHashtags, setSpan };