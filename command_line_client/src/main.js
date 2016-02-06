import craftai from 'craft-ai';
import loadCfg from './loadCfg';
import prompt from 'prompt';
import ON_DEATH from 'death';
import _ from'lodash';

let config = {
  "owner": "shemana",
  "name": "tutorials",
  "version": "master",
  "appId": "sOENibcq5ZjEk8uMZk9S",
  "appSecret": "pssvDmr0dLfKnrAvumSr8pW2zItrx5Te72wP8Yya",
  "httpApiUrl": "https://api.craft.ai/v1",
  "wsApiUrl": "wss://api.craft.ai/v1",
  "hubApiUrl": "https://api.craft.ai/v1"
}

craftai(config, {
    "temperature" : 24
}).then(instance => {
  //console.log(`'${instance}' successfully created!`);
  ON_DEATH(() => {
    instance.destroy()
      .then(() => console.log(`'${instance}' successfully destroyed!`));
  });
  return instance.createAgent('bts/senovia.bt', {
    name: 'Juliette', 
    temperature: 24,
    temperaturemoyenne: 19})
    .then(agent => {
      //\console.log(`agent #${agent} created.`)
    })
    .then(() => instance.registerAction(
      'ask',
      (requestId, agentId, input, success, failure) => {
        var questions = input.question.split('<br>')
        _.forEach(questions, (question) => {
          console.log(question);
        })
        prompt.message = "Senovia".rainbow;
        prompt.start()
        prompt.get(['reponse'], function (err, result) {
          console.log('reponse : ' + result.reponse);
          success({
            reponse : result.reponse == 'oui' ? true : false
          });
        })
      }))
    .then(() => instance.registerAction(
      'info',
      (requestId, agentId, input, success, failure) => {
        console.log(`${input.message}`);
        success();
        process.exit();
      }))
    .then(() => instance.update(200));
})
.catch((err) => {
  console.log('Unexpected error!');
  console.log(err);
});