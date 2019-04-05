import _ from 'lodash';

const unchangingPartOfMessage = (message: string) => {
  const messageWords = message.split(' ');
  // the last important part of the string which was not part of the time
  const statusIndex = _.findIndex(messageWords, (word: string) => {
    return _.includes(word, 'succ') || _.includes(word, 'fail');
  });
  const indices = [...messageWords.keys()];
  const unchangingMessageWordIndices = _.first(
    _.partition(indices, (index: number) => {
      return index <= statusIndex;
    }),
  );
  const unchangingMessageWords = _.map(unchangingMessageWordIndices, index => {
    return _.at(messageWords, index);
  });
  const unchangingMessagePart = _.flatten(unchangingMessageWords).join(' ');

  return unchangingMessagePart;
};

export { unchangingPartOfMessage };
