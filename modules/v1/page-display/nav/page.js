//页面渐隐
const forFade = ({current, closing}) => ({
    cardStyle: {
        opacity: current.progress,
    },
});


export default {
    forFade
}
