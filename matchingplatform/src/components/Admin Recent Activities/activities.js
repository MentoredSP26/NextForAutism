export function createActivity(content, group, time){
    return{
        content,
        group,
        time
    };
}

export const initialAct = [
    createActivity("Created match", "Alex & Jordan", "2h ago"),
    createActivity("Updated settings", "Alex & Jordan", "10h ago"),
    createActivity("Reports", "Q1 Analytics ", "2d ago")
] 