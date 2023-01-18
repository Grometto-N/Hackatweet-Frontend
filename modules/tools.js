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
    // récupération du temps écoulé en heure
    const timeDate = new Date(date)
    const now = new Date()
    const deltaHours = (now.getTime() - timeDate.getTime())/3600000;

    // vérificiation si annnées
    if(deltaHours > 17520){
        return  `${Math.floor(deltaHours/8760)} years`
    }
    if(deltaHours > 8760){
        return  `1 year`
    }

    // vérification si jours
    if(deltaHours > 48){
        return  `${Math.floor(deltaHours/24)} days`
    }
    if(deltaHours > 24){
        return  `1 day`
    }

    //  gestion si en heures
    if(deltaHours >2){
        return  `${Math.floor(deltaHours)} hours`
    }
    if(deltaHours >1){
        return  `${Math.floor(deltaHours)} hour`
    }

    return `${Math.floor(deltaHours * 60)} min`;
}


module.exports = { checkBody, getHashtags, setSpan, formattedDate };