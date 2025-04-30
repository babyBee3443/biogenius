
import * as React from 'react';

interface PlaceholderBlockProps {
    type: string;
}

const PlaceholderBlock: React.FC<PlaceholderBlockProps> = ({ type }) => (
    <div className="text-muted-foreground italic text-sm p-4 bg-muted/50 rounded">
        [{type} Bloku] - Bu blok tipi için düzenleyici henüz mevcut değil.
    </div>
);

export default PlaceholderBlock;
