import { Draggable } from '@hello-pangea/dnd';
import { memo, FC } from 'react';

import { EstimateCard } from 'src/components/Estimates/EstimateCard';
import { BuiltInWorkCardStatus, WorkCard } from 'src/models';

export interface CardProps {
  card: WorkCard;
  index: number;
  withPlateNumber?: boolean;
  disableDnD?: boolean;
  assignWorker?: boolean;
  onChangeStatus?: (value: BuiltInWorkCardStatus, cardID: string) => void;
  shopId?: string;
}

export const Card: FC<CardProps> = memo(({ card, disableDnD = false, index, onChangeStatus }) => {
  return (
    <>
      {disableDnD ? (
        <EstimateCard showWorkCard card={card} onChangeStatus={onChangeStatus} />
      ) : (
        <Draggable draggableId={`${card?.id}=${card.status}`} index={index}>
          {(provided) => (
            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
              <EstimateCard showWorkCard card={card} onChangeStatus={onChangeStatus} />
            </div>
          )}
        </Draggable>
      )}
    </>
  );
});
