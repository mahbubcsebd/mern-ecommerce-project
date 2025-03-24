import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { getFaqs } from '@/utils/faq';

const Faq = async () => {
    const faqs = await getFaqs();

    // Filter FAQs by category
    const accountFaqs = faqs.payload.faqs.filter(faq => faq.category === 'account');

    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
            >
                {accountFaqs.map((faq) => (
                    <AccordionItem key={faq._id} value={`item-${faq._id}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Faq;
