import React from 'react';
import AvatarList from './AvatarList';
import type { ListItemDataType } from '../data.d';

export type ProjectsProps = {
    data: ListItemDataType[],
}

const Cobuyers: React.FC<ProjectsProps> = ({ data: listData }) => {
    const cobuyers = listData.filter((item, idx, self) => (
        idx === self.findIndex((t) => (t.owner === item.owner)
        )));

    return (
        <>
            <AvatarList size="large">
                {/* todo! hookup logic */}
                {cobuyers.map((item) => (
                    <AvatarList.Item
                        key={`${item.owner}`}
                        src={item.avatar}
                        tips={item.owner}
                    />
                ))}
            </AvatarList>
            <span style={{ padding: '16px' }}>{`You've bought with ${3} cobuyers.`}</span>
        </>
    )
}

export default Cobuyers;